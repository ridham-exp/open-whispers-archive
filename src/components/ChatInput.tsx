import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileUpload } from "./FileUpload";
import { useDropzone } from 'react-dropzone';

interface ChatInputProps {
  onSendMessage: (message: string, fileData?: { url: string; name: string; type: string; size: number }) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // State for managing file uploads

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

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleFileSelect,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    noClick: true, // Prevents click to open file dialog on the entire form
    noKeyboard: true, // Prevents keyboard interaction
  });

  return (
    <form 
      {...getRootProps()}
      onSubmit={handleSubmit} 
      className={`p-4 bg-card/50 backdrop-blur-sm border border-border rounded-lg shadow-lg transition-all duration-200 space-y-3 relative mx-4 mb-4 ${
        isDragActive 
          ? 'after:absolute after:inset-0 after:bg-primary/5 after:border-2 after:border-dashed after:border-primary after:rounded-lg after:shadow-xl ring-2 ring-primary/20' 
          : 'hover:shadow-xl hover:border-primary/20'
      }`}
    >
      {/* Hidden file input for drag and drop */}
      <input {...getInputProps()} />
      
      {/* File preview */}
      {selectedFile && (
        <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-muted-foreground"
          >
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          <span className="text-sm truncate flex-1">{selectedFile.name}</span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering dropzone
              removeFile();
            }}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
      
      {isDragActive && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <p className="text-primary font-medium">Drop files here</p>
        </div>
      )}
      
      {/* Input row */}
      <div className="flex gap-3 relative z-20">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input flex-1"
          disabled={disabled || uploading}
          maxLength={500}
          onClick={(e) => e.stopPropagation()} // Prevent triggering dropzone
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering dropzone
            open(); // This directly opens the file explorer
          }}
          disabled={disabled || uploading}
          className="rounded-full w-12 h-12 p-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </Button>
        
        <Button 
          type="submit" 
          disabled={(!message.trim() && !selectedFile) || disabled || uploading}
          className="rounded-full w-12 h-12 p-0"
          onClick={(e) => e.stopPropagation()} // Prevent triggering dropzone
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