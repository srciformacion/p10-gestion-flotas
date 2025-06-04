
import { useState, useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, MoreVertical, Paperclip, Clock } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { MessageTemplateSelector } from "./MessageTemplateSelector";
import { MessageTemplate } from "@/types/message";
import { useAuth } from "@/context/AuthContext";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
    markConversationAsRead,
    isTyping
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

  const getParticipantInfo = () => {
    if (!conversation) return { name: 'Usuario', status: 'offline', avatar: '👤' };
    
    // Determinar información del participante basado en los mensajes
    const hasEmergencyKeywords = conversation.messages.some(msg => 
      msg.content.includes('🚨') || 
      msg.content.toLowerCase().includes('urgente') || 
      msg.content.toLowerCase().includes('emergencia')
    );
    
    const hasHospitalKeywords = conversation.messages.some(msg => 
      msg.content.toLowerCase().includes('hospital') || 
      msg.content.toLowerCase().includes('interhospitalario')
    );
    
    const hasDriverKeywords = conversation.messages.some(msg => 
      msg.content.toLowerCase().includes('ambulancia amb-') || 
      msg.content.toLowerCase().includes('servicio anterior')
    );

    if (hasEmergencyKeywords) {
      return { 
        name: 'Centro de Emergencias 112', 
        status: 'En servicio 24h', 
        avatar: '🚨',
        role: 'Emergencias'
      };
    } else if (hasHospitalKeywords) {
      return { 
        name: 'Hospital San Carlos', 
        status: 'En línea', 
        avatar: '🏥',
        role: 'Centro Hospitalario'
      };
    } else if (hasDriverKeywords) {
      return { 
        name: 'Miguel - Equipo Móvil', 
        status: 'En ruta', 
        avatar: '🚑',
        role: 'Conductor AMB-15'
      };
    } else {
      return { 
        name: user?.role === 'admin' ? 'Usuario Particular' : 'Centro Coordinador', 
        status: 'En línea', 
        avatar: user?.role === 'admin' ? '👤' : '📞',
        role: user?.role === 'admin' ? 'Cliente' : 'Administración'
      };
    }
  };

  const getParticipantName = (senderId: string) => {
    if (user?.id === senderId) return user.name || 'Tú';
    
    const participantInfo = getParticipantInfo();
    return participantInfo.name;
  };
  
  if (!conversation) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <div className="mb-4 text-4xl">💬</div>
          <p className="text-muted-foreground text-lg mb-2">Selecciona una conversación</p>
          <p className="text-sm text-muted-foreground">
            Elige una conversación de la lista para comenzar a chatear
          </p>
        </CardContent>
      </Card>
    );
  }

  const participantInfo = getParticipantInfo();
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={participantAvatar} />
              <AvatarFallback className="text-lg">
                {participantInfo.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div>
            <CardTitle className="text-lg">
              {participantInfo.name}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {participantInfo.role}
              </Badge>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">
                  {participantInfo.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" title="Llamar">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Videollamada">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Más opciones">
            <MoreVertical className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} title="Cerrar">
              ×
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {/* Fecha de inicio de conversación */}
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                Conversación iniciada el {format(new Date(messages[0]?.timestamp || Date.now()), 'PPP', { locale: es })}
              </div>
            </div>
            
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                senderName={getParticipantName(message.senderId)}
              />
            ))}
            
            {/* Indicador de escribiendo */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span>{participantInfo.name} está escribiendo...</span>
              </div>
            )}
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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowTemplates(!showTemplates)}
              title="Plantillas de mensaje"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim()}
              title="Enviar mensaje"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
