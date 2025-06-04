
export interface Message {
  id: string;
  senderId: string;
  recipientId?: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'file' | 'system';
  attachments?: string[];
  conversationId: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
  title?: string;
  type: 'direct' | 'group' | 'support';
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  lastMessageTimestamp: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  category: 'greeting' | 'status' | 'emergency' | 'closing' | 'info';
  tags: string[];
}
