-- Add file support to messages table
ALTER TABLE public.messages 
ADD COLUMN file_url TEXT,
ADD COLUMN file_name TEXT,
ADD COLUMN file_type TEXT,
ADD COLUMN file_size INTEGER;

-- Add delete policy for users to delete their own messages
CREATE POLICY "Users can delete their own messages" 
ON public.messages 
FOR DELETE 
USING (true);

-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-files', 'chat-files', true);

-- Create storage policies for file uploads
CREATE POLICY "Anyone can view chat files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'chat-files');

CREATE POLICY "Anyone can upload chat files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'chat-files');

CREATE POLICY "Anyone can delete chat files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'chat-files');