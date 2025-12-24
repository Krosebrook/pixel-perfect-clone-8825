import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePulseResponses } from '@/hooks/usePulseResponses';
import { cn } from '@/lib/utils';
import { Check, Smile } from 'lucide-react';

const moodOptions = [
  { value: 1, emoji: '😔', label: 'Very Low', color: 'bg-red-500' },
  { value: 2, emoji: '😕', label: 'Low', color: 'bg-orange-500' },
  { value: 3, emoji: '😐', label: 'Neutral', color: 'bg-yellow-500' },
  { value: 4, emoji: '🙂', label: 'Good', color: 'bg-lime-500' },
  { value: 5, emoji: '😄', label: 'Great', color: 'bg-green-500' },
];

export const PulseSurvey = () => {
  const { hasSubmittedToday, submitPulse } = usePulseResponses();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    await submitPulse(selectedMood, feedback);
    setIsSubmitting(false);
    setSelectedMood(null);
    setFeedback('');
  };

  if (hasSubmittedToday) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Thanks for sharing!</h3>
            <p className="text-sm text-muted-foreground">
              You've already submitted your pulse today. Come back tomorrow!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Smile className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Daily Pulse Check</CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between gap-2">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedMood(option.value)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all hover:scale-105',
                selectedMood === option.value
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border/50 bg-background/50 hover:border-primary/50'
              )}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="text-xs text-muted-foreground">{option.label}</span>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="space-y-3 animate-fade-in">
            <Textarea
              placeholder="Any additional thoughts? (optional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[80px] resize-none border-border/50 bg-background/50"
            />
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Pulse'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
