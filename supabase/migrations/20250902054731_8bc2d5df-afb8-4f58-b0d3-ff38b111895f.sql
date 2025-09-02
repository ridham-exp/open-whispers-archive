-- Create messages table for the universal chat
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable realtime for messages table
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create index for better performance when fetching messages
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Since this is a public chat, we'll make messages readable by everyone
-- No RLS needed as anyone should be able to read and write messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read all messages
CREATE POLICY "Anyone can read messages" 
ON public.messages 
FOR SELECT 
USING (true);

-- Allow everyone to insert messages
CREATE POLICY "Anyone can insert messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);