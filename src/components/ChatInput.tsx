import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (message: string, fileData?: { url: string; name: string; type: string; size: number }) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || selectedFile) && !disabled && !uploading) {
      setUploading(true);
      
      try {
        let fileData = undefined;
        
        if (selectedFile) {
          // Upload file to Supabase storage
          const fileExt = selectedFile.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from('chat-files')
            .upload(fileName, selectedFile);

          if (error) {
            throw error;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('chat-files')
            .getPublicUrl(fileName);

          fileData = {
            url: publicUrl,
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size
          };
        }

        onSendMessage(message.trim(), fileData);
        setMessage("");
        setSelectedFile(null);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload file');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('File type not supported. Please upload images, PDFs, Word documents, or text files.');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-card/50 backdrop-blur-sm border-t border-border space-y-3">
      {/* File preview */}
      {selectedFile && (
        <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg">
          <Paperclip className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm truncate flex-1">{selectedFile.name}</span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={removeFile}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
      
      {/* Input row */}
      <div className="flex gap-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input flex-1"
          disabled={disabled || uploading}
          maxLength={500}
        />
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="rounded-full w-12 h-12 p-0"
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        
        <Button 
          type="submit" 
          disabled={(!message.trim() && !selectedFile) || disabled || uploading}
          className="rounded-full w-12 h-12 p-0"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </form>
  );
};