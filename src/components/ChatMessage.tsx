import { format } from "date-fns";
import { Copy, Trash2, Download, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChatMessageProps {
  message: {
    id: string;
    username: string;
    message: string;
    created_at: string;
    file_url?: string;
    file_name?: string;
    file_type?: string;
    file_size?: number;
  };
  currentUser?: string;
  isNew?: boolean;
  onDelete?: (messageId: string) => void;
}

export const ChatMessage = ({ message, currentUser, isNew, onDelete }: ChatMessageProps) => {
  const isOwnMessage = currentUser === message.username;
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.message);
      toast.success("Message copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
  };

  const handleDownload = async () => {
    if (message.file_url && message.file_name) {
      try {
        const response = await fetch(message.file_url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = message.file_name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("File downloaded successfully!");
      } catch (error) {
        toast.error("Failed to download file");
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div 
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 ${
        isNew ? 'animate-bounce-in' : ''
      }`}
      style={{
        animation: isNew ? 'var(--bounce-in)' : undefined
      }}
    >
      <div className={`message-bubble ${isOwnMessage ? 'message-own' : 'message-other'} group relative`}>
        {!isOwnMessage && (
          <div className="font-semibold text-xs text-primary mb-1">
            {message.username}
          </div>
        )}
        
        {message.message && (
          <div className="text-sm leading-relaxed mb-2">
            {message.message}
          </div>
        )}

        {/* File attachment */}
        {message.file_url && (
          <div className="mb-2">
            {message.file_type?.startsWith('image/') ? (
              <div className="relative">
                <img 
                  src={message.file_url} 
                  alt={message.file_name} 
                  className="max-w-xs max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.file_url, '_blank')}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleDownload}
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-card/50 rounded-lg border">
                {getFileIcon(message.file_type || '')}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{message.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {message.file_size && formatFileSize(message.file_size)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  className="shrink-0"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className={`text-xs ${
            isOwnMessage ? 'text-white/70' : 'text-muted-foreground'
          }`}>
            {format(new Date(message.created_at), 'HH:mm')}
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-6 w-6 p-0 hover:bg-background/20"
            >
              <Copy className="w-3 h-3" />
            </Button>
            {isOwnMessage && onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                className="h-6 w-6 p-0 hover:bg-destructive/20 text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};