import { Users, MessageSquare, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] gradient-hero overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-20 pb-16">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-16 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Interact</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Features</a>
            <a href="#dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Dashboard</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button variant="default" size="sm">Get Started</Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 animate-slide-up">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-accent">New: AI-Powered Insights</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight animate-slide-up delay-100">
              Unite Your Team.{" "}
              <span className="text-gradient-primary">Amplify</span>{" "}
              Engagement.
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl animate-slide-up delay-200">
              The modern employee experience platform that brings your entire workforce together. From company news to recognition, make every voice heard.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-slide-up delay-300">
              <Button variant="hero" size="xl">
                Start Free Trial
              </Button>
              <Button variant="heroOutline" size="xl">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4 animate-slide-up delay-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground"><strong className="text-foreground">10k+</strong> Teams</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground"><strong className="text-foreground">2M+</strong> Messages</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground"><strong className="text-foreground">85%</strong> Engagement</span>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[500px] flex items-center justify-center animate-scale-in delay-200">
            <img
              src={heroImage}
              alt="Team collaboration illustration"
              className="w-full h-full object-contain animate-float"
            />
            
            {/* Floating stat cards */}
            <div className="absolute top-10 right-0 bg-card border rounded-xl p-4 shadow-elevated animate-float delay-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">+42%</p>
                  <p className="text-xs text-muted-foreground">Team Productivity</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-20 left-0 bg-card border rounded-xl p-4 shadow-elevated animate-float delay-400">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-bold ${i === 1 ? 'bg-primary text-primary-foreground' : i === 2 ? 'bg-accent text-accent-foreground' : 'bg-success text-success-foreground'}`}>
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Active Now</p>
                  <p className="text-xs text-muted-foreground">12 team members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
