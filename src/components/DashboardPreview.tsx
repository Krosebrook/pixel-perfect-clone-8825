import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Award, 
  Bell,
  ChevronRight,
  MoreHorizontal,
  Heart,
  Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";

const activityItems = [
  {
    id: 1,
    type: "recognition",
    user: "Sarah Chen",
    action: "recognized",
    target: "Alex Rivera",
    message: "for outstanding work on the Q4 presentation",
    time: "2 min ago",
    avatar: "SC",
    avatarBg: "bg-primary",
  },
  {
    id: 2,
    type: "announcement",
    user: "Company News",
    action: "",
    target: "",
    message: "Holiday Schedule 2024 has been published",
    time: "15 min ago",
    avatar: "📢",
    avatarBg: "bg-accent",
  },
  {
    id: 3,
    type: "poll",
    user: "HR Team",
    action: "created a poll",
    target: "",
    message: "What day works best for the team building event?",
    time: "1 hour ago",
    avatar: "HR",
    avatarBg: "bg-success",
  },
];

const quickStats = [
  { label: "Team Pulse", value: "87%", trend: "+5%", icon: Heart, color: "text-destructive" },
  { label: "Active Users", value: "234", trend: "+12", icon: Users, color: "text-primary" },
  { label: "Messages Today", value: "1.2k", trend: "+8%", icon: MessageSquare, color: "text-info" },
  { label: "Recognitions", value: "45", trend: "+3", icon: Award, color: "text-accent" },
];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Dashboard
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Your Team at a Glance
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-time insights and activities from across your organization, all in one beautiful interface.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-3xl border shadow-elevated overflow-hidden">
            {/* Dashboard Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">JD</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Good morning, Jordan!</h3>
                  <p className="text-sm text-muted-foreground">Here's what's happening in your team today</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">3</span>
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {quickStats.map((stat, index) => (
                  <div 
                    key={stat.label} 
                    className="p-4 rounded-xl bg-secondary/50 border animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-xs font-medium text-success flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Activity Feed */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">Recent Activity</h4>
                    <Button variant="ghost" size="sm">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {activityItems.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="p-4 rounded-xl border bg-background hover:shadow-card transition-all duration-200 animate-slide-up"
                        style={{ animationDelay: `${(index + 4) * 100}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full ${item.avatarBg} flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0`}>
                            {item.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">
                              <span className="font-semibold">{item.user}</span>
                              {item.action && ` ${item.action} `}
                              {item.target && <span className="font-semibold">{item.target}</span>}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{item.message}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-muted-foreground">{item.time}</span>
                              <div className="flex items-center gap-2">
                                <button className="text-muted-foreground hover:text-destructive transition-colors">
                                  <Heart className="w-4 h-4" />
                                </button>
                                <button className="text-muted-foreground hover:text-primary transition-colors">
                                  <MessageSquare className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <button className="text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Pulse */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">Team Pulse</h4>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="p-6 rounded-xl border bg-gradient-to-br from-primary/5 to-accent/5 animate-scale-in delay-500">
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-2">
                        <Smile className="w-16 h-16 mx-auto text-success" />
                      </div>
                      <p className="text-3xl font-bold text-foreground">87%</p>
                      <p className="text-sm text-muted-foreground">Overall Happiness</p>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { label: "Work-Life Balance", value: 85, color: "bg-success" },
                        { label: "Team Collaboration", value: 92, color: "bg-primary" },
                        { label: "Growth Opportunities", value: 78, color: "bg-accent" },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium text-foreground">{item.value}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <div 
                              className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="accent" className="w-full">
                    Submit Your Pulse
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
