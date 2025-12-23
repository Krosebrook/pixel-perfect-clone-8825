import { 
  Users, 
  MessageSquare, 
  Award, 
  BarChart3, 
  Bell, 
  Zap 
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Team Communication",
    description: "Real-time messaging, channels, and threads to keep everyone connected and informed.",
    color: "primary" as const,
  },
  {
    icon: Award,
    title: "Recognition & Rewards",
    description: "Celebrate achievements with peer-to-peer recognition and reward programs.",
    color: "accent" as const,
  },
  {
    icon: BarChart3,
    title: "Engagement Analytics",
    description: "Track team pulse, sentiment, and participation with actionable insights.",
    color: "success" as const,
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "AI-powered notifications that prioritize what matters most to each employee.",
    color: "info" as const,
  },
  {
    icon: Users,
    title: "Team Directory",
    description: "Find and connect with colleagues across departments and locations easily.",
    color: "primary" as const,
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "Complete tasks, submit requests, and access resources in seconds.",
    color: "accent" as const,
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/20",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
  },
  info: {
    bg: "bg-info/10",
    text: "text-info",
    border: "border-info/20",
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Features
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Everything Your Team Needs
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools designed to boost engagement, foster collaboration, and create a thriving workplace culture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color];
            return (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl border bg-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${colors.text}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
