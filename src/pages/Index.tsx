import { useState, useEffect } from "react";
import { NameEntryModal } from "@/components/NameEntryModal";
import { ChatRoom } from "@/components/ChatRoom";

const Index = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [showNameModal, setShowNameModal] = useState(true);

  // Check if user has already entered their name
  useEffect(() => {
    const savedUsername = localStorage.getItem('chat-username');
    if (savedUsername) {
      setUsername(savedUsername);
      setShowNameModal(false);
    }
  }, []);

  const handleNameSubmit = (name: string) => {
    setUsername(name);
    localStorage.setItem('chat-username', name);
    setShowNameModal(false);
  };

  const handleModalClose = () => {
    setShowNameModal(false);
  };

  return (
    <>
      {showNameModal && (
        <NameEntryModal 
          open={true} 
          onNameSubmit={handleNameSubmit}
          onClose={handleModalClose}
        />
      )}
      <ChatRoom username={username} />
    </>
  );
};

export default Index;
