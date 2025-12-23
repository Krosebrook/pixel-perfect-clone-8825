import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Recognition {
  id: string;
  giver_id: string;
  receiver_id: string;
  message: string;
  badge_type: string;
  created_at: string;
  giver: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  receiver: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface Profile {
  id: string;
  full_name: string | null;
}

export const useRecognitions = () => {
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRecognitions = async () => {
    const { data, error } = await supabase
      .from('recognitions')
      .select(`
        id,
        giver_id,
        receiver_id,
        message,
        badge_type,
        created_at,
        giver:profiles!recognitions_giver_id_fkey (
          full_name,
          avatar_url
        ),
        receiver:profiles!recognitions_receiver_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching recognitions:', error);
    } else {
      setRecognitions(data as Recognition[]);
    }
    setLoading(false);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name')
      .order('full_name');

    if (error) {
      console.error('Error fetching profiles:', error);
    } else {
      setProfiles(data || []);
    }
  };

  const giveRecognition = async (receiverId: string, message: string, badgeType: string) => {
    if (!user || !receiverId || !message.trim()) return;

    const { error } = await supabase.from('recognitions').insert({
      giver_id: user.id,
      receiver_id: receiverId,
      message: message.trim(),
      badge_type: badgeType,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to send recognition',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Recognition sent!',
        description: 'Your appreciation has been shared with the team.',
      });
    }
  };

  useEffect(() => {
    fetchRecognitions();
    fetchProfiles();

    // Subscribe to real-time recognitions
    const channel = supabase
      .channel('recognitions-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'recognitions',
        },
        async (payload) => {
          const { data } = await supabase
            .from('recognitions')
            .select(`
              id,
              giver_id,
              receiver_id,
              message,
              badge_type,
              created_at,
              giver:profiles!recognitions_giver_id_fkey (
                full_name,
                avatar_url
              ),
              receiver:profiles!recognitions_receiver_id_fkey (
                full_name,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setRecognitions((prev) => [data as Recognition, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { recognitions, profiles, loading, giveRecognition };
};
