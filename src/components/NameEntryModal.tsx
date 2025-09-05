import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface NameEntryModalProps {
  open: boolean;
  onNameSubmit: (name: string) => void;
  onClose: () => void;
}

export const NameEntryModal = ({ open, onNameSubmit, onClose }: NameEntryModalProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">Welcome to Universal Chat</DialogTitle>
          <p className="text-muted-foreground mt-2">
            Enter your name to join the conversation. No registration required!
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <Input
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-center text-lg py-3"
            maxLength={30}
            autoFocus
          />
          <Button 
            type="submit" 
            className="w-full py-3 text-lg font-medium"
            disabled={!name.trim()}
          >
            Join Chat
          </Button>
          <Button 
            type="button"
            variant="outline" 
            className="w-full py-3 text-lg font-medium"
            onClick={onClose}
          >
            Browse as Guest
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};