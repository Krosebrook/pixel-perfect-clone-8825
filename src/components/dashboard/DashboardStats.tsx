import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageCircle, Award, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  messageCount: number;
  recognitionCount: number;
  teamMemberCount: number;
}

const DashboardStats = ({ messageCount, recognitionCount, teamMemberCount }: DashboardStatsProps) => {
  const stats = [
    {
      label: 'Team Members',
      value: teamMemberCount,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Messages Today',
      value: messageCount,
      icon: MessageCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Recognitions',
      value: recognitionCount,
      icon: Award,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Engagement',
      value: messageCount + recognitionCount > 0 ? 'Active' : 'Start!',
      icon: TrendingUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
