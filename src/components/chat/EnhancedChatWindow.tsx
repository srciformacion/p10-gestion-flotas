
import { useState, useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, MoreVertical, Paperclip } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { MessageTemplateSelector } from "./MessageTemplateSelector";
import { MessageTemplate } from "@/types/message";
import { useAuth } from "@/context/AuthContext";

interface EnhancedChatWindowProps {
  conversationId?: string;
  participantName?: string;
  participantRole?: string;
  participantAvatar?: string;
  onClose?: () => void;
}

export const EnhancedChatWindow = ({
  conversationId,
  participantName,
  participantRole,
  participantAvatar,
  onClose
}: EnhancedChatWindowProps) => {
  const { 
    conversations, 
    sendMessage,
    currentConversation,
    markConversationAsRead
  } = useChat();
  
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const conversation = conversationId 
    ? conversations.find(c => c.id === conversationId)
    : currentConversation;
  
  const messages = conversation?.messages || [];
  
  useEffect(() => {
    if (conversation && conversation.unreadCount > 0) {
      markConversationAsRead(conversation.id);
    }
  }, [conversation, markConversationAsRead]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage("");
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleTemplateSelect = (template: MessageTemplate) => {
    setNewMessage(template.content);
    setShowTemplates(false);
  };

  const getParticipantName = (senderId: string) => {
    if (user?.id === senderId) return user.name || 'Tú';
    return participantName || (user?.role === 'admin' ? 'Usuario' : 'Administrador');
  };
  
  if (!conversation) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">Conversación no encontrada</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={participantAvatar} />
            <AvatarFallback>
              {(participantName || 'Admin').split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {participantName || (user?.role === 'admin' ? 'Usuario' : 'Administración')}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {participantRole && (
                <Badge variant="secondary" className="text-xs">
                  {participantRole}
                </Badge>
              )}
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">
                  En línea
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                senderName={getParticipantName(message.senderId)}
              />
            ))}
          </div>
        </ScrollArea>
        
        {showTemplates && (
          <div className="border-t p-4">
            <MessageTemplateSelector 
              onSelectTemplate={handleTemplateSelect}
              onClose={() => setShowTemplates(false)}
            />
          </div>
        )}
        
        <div className="border-t p-4">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[40px] resize-none"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowTemplates(!showTemplates)}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
