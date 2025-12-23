import { useAuth } from '@/contexts/AuthContext';
import { useMessages } from '@/hooks/useMessages';
import { useRecognitions } from '@/hooks/useRecognitions';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users, LogOut, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardStats from '@/components/dashboard/DashboardStats';
import MessageFeed from '@/components/dashboard/MessageFeed';
import RecognitionWall from '@/components/dashboard/RecognitionWall';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { messages } = useMessages();
  const { recognitions, profiles } = useRecognitions();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Interact</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">{userName}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userName.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your team today.
          </p>
        </div>

        {/* Stats */}
        <DashboardStats
          messageCount={messages.length}
          recognitionCount={recognitions.length}
          teamMemberCount={profiles.length}
        />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="h-[600px]">
            <MessageFeed />
          </div>
          <div className="h-[600px]">
            <RecognitionWall />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
