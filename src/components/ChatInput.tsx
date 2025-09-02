import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4 bg-card/50 backdrop-blur-sm border-t border-border">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="chat-input flex-1"
        disabled={disabled}
        maxLength={500}
      />
      <Button 
        type="submit" 
        disabled={!message.trim() || disabled}
        className="rounded-full w-12 h-12 p-0"
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
};