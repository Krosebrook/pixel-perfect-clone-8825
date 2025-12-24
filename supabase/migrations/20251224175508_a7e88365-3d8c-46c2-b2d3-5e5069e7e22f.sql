-- Create pulse_responses table for mood surveys
CREATE TABLE public.pulse_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pulse_responses ENABLE ROW LEVEL SECURITY;

-- Users can view all pulse responses (for analytics)
CREATE POLICY "Authenticated users can view pulse responses"
ON public.pulse_responses
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Users can submit their own pulse responses
CREATE POLICY "Users can submit pulse responses"
ON public.pulse_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Enable realtime for pulse responses
ALTER PUBLICATION supabase_realtime ADD TABLE public.pulse_responses;