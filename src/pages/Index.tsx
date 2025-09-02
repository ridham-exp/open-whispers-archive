import { useState, useEffect } from "react";
import { NameEntryModal } from "@/components/NameEntryModal";
import { ChatRoom } from "@/components/ChatRoom";

const Index = () => {
  const [username, setUsername] = useState<string | null>(null);

  // Check if user has already entered their name
  useEffect(() => {
    const savedUsername = localStorage.getItem('chat-username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleNameSubmit = (name: string) => {
    setUsername(name);
    localStorage.setItem('chat-username', name);
  };

  if (!username) {
    return <NameEntryModal open={true} onNameSubmit={handleNameSubmit} />;
  }

  return <ChatRoom username={username} />;
};

export default Index;
