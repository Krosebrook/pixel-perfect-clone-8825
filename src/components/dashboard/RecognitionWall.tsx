import { useState } from 'react';
import { useRecognitions } from '@/hooks/useRecognitions';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, Star, Heart, Zap, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const badgeIcons: Record<string, React.ReactNode> = {
  star: <Star className="h-4 w-4 text-amber-500" />,
  heart: <Heart className="h-4 w-4 text-rose-500" />,
  zap: <Zap className="h-4 w-4 text-amber-500" />,
  thumbsup: <ThumbsUp className="h-4 w-4 text-primary" />,
};

const RecognitionWall = () => {
  const { recognitions, profiles, loading, giveRecognition } = useRecognitions();
  const { user } = useAuth();
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [badgeType, setBadgeType] = useState('star');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!receiverId || !message.trim() || sending) return;
    setSending(true);
    await giveRecognition(receiverId, message, badgeType);
    setReceiverId('');
    setMessage('');
    setBadgeType('star');
    setSending(false);
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const otherProfiles = profiles.filter((p) => p.id !== user?.id);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="h-5 w-5 text-accent" />
          Recognition Wall
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Give Recognition Form */}
        <div className="mb-4 space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="flex gap-2">
            <Select value={receiverId} onValueChange={setReceiverId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a colleague" />
              </SelectTrigger>
              <SelectContent>
                {otherProfiles.length === 0 ? (
                  <SelectItem value="none" disabled>No team members yet</SelectItem>
                ) : (
                  otherProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.full_name || 'Team Member'}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select value={badgeType} onValueChange={setBadgeType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="star">⭐ Star</SelectItem>
                <SelectItem value="heart">❤️ Heart</SelectItem>
                <SelectItem value="zap">⚡ Energy</SelectItem>
                <SelectItem value="thumbsup">👍 Kudos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Share why you appreciate this person..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none min-h-[60px]"
            maxLength={300}
          />

          <Button 
            onClick={handleSubmit} 
            disabled={!receiverId || !message.trim() || sending}
            size="sm"
            className="w-full"
          >
            <Award className="h-4 w-4 mr-1" />
            Give Recognition
          </Button>
        </div>

        {/* Recognitions List */}
        <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading recognitions...</div>
          ) : recognitions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recognitions yet. Be the first to appreciate a colleague!
            </div>
          ) : (
            recognitions.map((recognition) => (
              <div
                key={recognition.id}
                className="p-3 rounded-lg bg-gradient-to-r from-accent/10 to-primary/5 border border-border/30"
              >
                <div className="flex items-start gap-3">
                  <div className="flex -space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="text-xs bg-primary/20 text-primary">
                        {getInitials(recognition.giver?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="text-xs bg-accent/20 text-accent">
                        {getInitials(recognition.receiver?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-sm text-foreground">
                        {recognition.giver?.full_name || 'Someone'}
                      </span>
                      <span className="text-xs text-muted-foreground">recognized</span>
                      <span className="font-medium text-sm text-foreground">
                        {recognition.receiver?.full_name || 'a colleague'}
                      </span>
                      {badgeIcons[recognition.badge_type]}
                    </div>
                    <p className="text-sm text-foreground/80 break-words">{recognition.message}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {formatDistanceToNow(new Date(recognition.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecognitionWall;
