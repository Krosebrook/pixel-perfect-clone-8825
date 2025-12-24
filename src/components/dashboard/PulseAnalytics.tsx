import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePulseResponses } from '@/hooks/usePulseResponses';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const moodEmojis = ['', '😔', '😕', '😐', '🙂', '😄'];
const moodColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

export const PulseAnalytics = () => {
  const { stats, loading } = usePulseResponses();

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.totalResponses === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">No Data Yet</h3>
            <p className="text-sm text-muted-foreground">
              Pulse analytics will appear once team members start submitting responses.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMoodLabel = (avg: number) => {
    if (avg >= 4.5) return 'Excellent';
    if (avg >= 3.5) return 'Good';
    if (avg >= 2.5) return 'Neutral';
    if (avg >= 1.5) return 'Low';
    return 'Very Low';
  };

  const maxCount = Math.max(...stats.moodDistribution.map(d => d.count), 1);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <BarChart3 className="h-4 w-4 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg">Pulse Analytics</CardTitle>
            <CardDescription>Team mood insights</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border/50 bg-background/50 p-3 text-center">
            <div className="mb-1 text-2xl font-bold text-foreground">
              {stats.averageMood.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Avg Mood</div>
            <div className="mt-1 text-lg">{moodEmojis[Math.round(stats.averageMood)]}</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-background/50 p-3 text-center">
            <div className="mb-1 text-2xl font-bold text-foreground">
              {stats.totalResponses}
            </div>
            <div className="text-xs text-muted-foreground">Responses</div>
            <Users className="mx-auto mt-1 h-5 w-5 text-muted-foreground" />
          </div>
          <div className="rounded-xl border border-border/50 bg-background/50 p-3 text-center">
            <div className="mb-1 text-2xl font-bold text-foreground">
              {getMoodLabel(stats.averageMood)}
            </div>
            <div className="text-xs text-muted-foreground">Status</div>
            <Activity className="mx-auto mt-1 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Mood Distribution */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <span>Mood Distribution</span>
          </h4>
          <div className="space-y-2">
            {stats.moodDistribution.map((item) => (
              <div key={item.mood} className="flex items-center gap-3">
                <span className="w-6 text-center text-lg">{moodEmojis[item.mood]}</span>
                <div className="flex-1">
                  <div className="h-6 overflow-hidden rounded-full bg-muted/30">
                    <div
                      className={cn('h-full rounded-full transition-all', moodColors[item.mood])}
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="w-8 text-right text-sm text-muted-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Trend */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>7-Day Trend</span>
          </h4>
          <div className="flex items-end justify-between gap-1 h-20">
            {stats.recentTrend.map((avg, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-1">
                <div 
                  className={cn(
                    'w-full rounded-t transition-all',
                    avg > 0 ? moodColors[Math.round(avg)] : 'bg-muted/30'
                  )}
                  style={{ height: avg > 0 ? `${(avg / 5) * 100}%` : '4px' }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(Date.now() - (6 - index) * 86400000).getDay()]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
