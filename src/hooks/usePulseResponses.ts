import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PulseResponse {
  id: string;
  user_id: string;
  mood: number;
  feedback: string | null;
  created_at: string;
}

interface MoodStats {
  averageMood: number;
  totalResponses: number;
  moodDistribution: { mood: number; count: number }[];
  recentTrend: number[];
}

export const usePulseResponses = () => {
  const [responses, setResponses] = useState<PulseResponse[]>([]);
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchResponses = async () => {
    const { data, error } = await supabase
      .from('pulse_responses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching pulse responses:', error);
      return;
    }

    setResponses(data || []);
    calculateStats(data || []);
    checkTodaySubmission(data || []);
    setLoading(false);
  };

  const checkTodaySubmission = (data: PulseResponse[]) => {
    if (!user) return;
    
    const today = new Date().toDateString();
    const todaySubmission = data.find(
      r => r.user_id === user.id && new Date(r.created_at).toDateString() === today
    );
    setHasSubmittedToday(!!todaySubmission);
  };

  const calculateStats = (data: PulseResponse[]) => {
    if (data.length === 0) {
      setStats({
        averageMood: 0,
        totalResponses: 0,
        moodDistribution: [],
        recentTrend: []
      });
      return;
    }

    const totalMood = data.reduce((sum, r) => sum + r.mood, 0);
    const averageMood = totalMood / data.length;

    const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach(r => {
      distribution[r.mood]++;
    });

    const moodDistribution = Object.entries(distribution).map(([mood, count]) => ({
      mood: parseInt(mood),
      count
    }));

    // Get last 7 days trend
    const last7Days: { [key: string]: number[] } = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      last7Days[date.toDateString()] = [];
    }

    data.forEach(r => {
      const dateKey = new Date(r.created_at).toDateString();
      if (last7Days[dateKey]) {
        last7Days[dateKey].push(r.mood);
      }
    });

    const recentTrend = Object.values(last7Days).map(moods => 
      moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 0
    );

    setStats({
      averageMood,
      totalResponses: data.length,
      moodDistribution,
      recentTrend
    });
  };

  const submitPulse = async (mood: number, feedback?: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('pulse_responses')
      .insert({
        user_id: user.id,
        mood,
        feedback: feedback || null
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit your pulse. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Thanks for sharing!',
      description: 'Your pulse has been recorded.',
    });

    setHasSubmittedToday(true);
  };

  useEffect(() => {
    fetchResponses();

    const channel = supabase
      .channel('pulse_responses')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'pulse_responses' },
        () => {
          fetchResponses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    responses,
    stats,
    loading,
    hasSubmittedToday,
    submitPulse
  };
};
