import { format } from "date-fns";

interface ChatMessageProps {
  message: {
    id: string;
    username: string;
    message: string;
    created_at: string;
  };
  currentUser?: string;
  isNew?: boolean;
}

export const ChatMessage = ({ message, currentUser, isNew }: ChatMessageProps) => {
  const isOwnMessage = currentUser === message.username;
  
  return (
    <div 
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 ${
        isNew ? 'animate-bounce-in' : ''
      }`}
      style={{
        animation: isNew ? 'var(--bounce-in)' : undefined
      }}
    >
      <div className={`message-bubble ${isOwnMessage ? 'message-own' : 'message-other'}`}>
        {!isOwnMessage && (
          <div className="font-semibold text-xs text-primary mb-1">
            {message.username}
          </div>
        )}
        <div className="text-sm leading-relaxed">
          {message.message}
        </div>
        <div className={`text-xs mt-2 ${
          isOwnMessage ? 'text-white/70' : 'text-muted-foreground'
        }`}>
          {format(new Date(message.created_at), 'HH:mm')}
        </div>
      </div>
    </div>
  );
};