
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, Conversation } from '@/types';
import { useAuth } from '@/context/auth';
import { toast } from '@/hooks/use-toast';

// Mock data for development purposes
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participantIds: ['admin-id', 'user1'],
    messages: [
      {
        id: '1',
        senderId: 'admin-id',
        content: 'Hola, ¿en qué podemos ayudarte?',
        timestamp: new Date(Date.now() - 50000000).toISOString(),
        read: true
      },
      {
        id: '2',
        senderId: 'user1',
        content: 'Tengo una consulta sobre mi solicitud de transporte',
        timestamp: new Date(Date.now() - 40000000).toISOString(),
        read: true
      },
      {
        id: '3',
        senderId: 'admin-id',
        content: 'Claro, dime el número de solicitud por favor',
        timestamp: new Date(Date.now() - 30000000).toISOString(),
        read: true
      }
    ],
    lastMessageTimestamp: new Date(Date.now() - 30000000).toISOString(),
    unreadCount: 0
  },
  {
    id: '2',
    participantIds: ['admin-id', 'user2'],
    messages: [
      {
        id: '1',
        senderId: 'user2',
        content: 'Buenos días, ¿podría consultar el estado de mi solicitud?',
        timestamp: new Date(Date.now() - 20000000).toISOString(),
        read: true
      },
      {
        id: '2',
        senderId: 'admin-id',
        content: 'Buenos días, ¿me podría indicar su DNI para verificar?',
        timestamp: new Date(Date.now() - 10000000).toISOString(),
        read: false
      }
    ],
    lastMessageTimestamp: new Date(Date.now() - 10000000).toISOString(),
    unreadCount: 1
  }
];

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  totalUnread: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    // When a real API is integrated, this would fetch conversations from the server
    if (user) {
      if (user.role === 'admin') {
        // Admins can see all conversations
        setConversations(MOCK_CONVERSATIONS);
      } else {
        // Regular users can only see their own conversations with admin
        const userConversations = MOCK_CONVERSATIONS.filter(
          (conversation) => conversation.participantIds.includes(user.id)
        );
        setConversations(userConversations);
      }
    }
  }, [user]);

  const sendMessage = (content: string) => {
    if (!currentConversation || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedConversation: Conversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
      lastMessageTimestamp: newMessage.timestamp,
      unreadCount: user.role === 'admin' ? 0 : currentConversation.unreadCount + 1
    };

    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === currentConversation.id ? updatedConversation : conv
      )
    );
    setCurrentConversation(updatedConversation);

    // Play notification sound for the recipient (would be implemented with websockets in a real app)
    playNotificationSound();
    
    toast({
      title: "Mensaje enviado",
      description: "Su mensaje ha sido enviado correctamente"
    });
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map((msg) => ({ ...msg, read: true }))
          };
        }
        return conv;
      })
    );

    if (currentConversation?.id === conversationId) {
      setCurrentConversation({
        ...currentConversation,
        unreadCount: 0,
        messages: currentConversation.messages.map((msg) => ({ ...msg, read: true }))
      });
    }
  };

  const playNotificationSound = () => {
    // In a real implementation, this would play a sound
    // For now, we'll just log to console
    console.log('New message notification!');
  };

  const totalUnread = conversations.reduce(
    (total, conv) => total + conv.unreadCount,
    0
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        setCurrentConversation,
        sendMessage,
        markConversationAsRead,
        totalUnread
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
