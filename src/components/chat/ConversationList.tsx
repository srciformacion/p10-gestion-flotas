
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const ConversationList = () => {
  const { conversations, setCurrentConversation, currentConversation, markConversationAsRead } = useChat();
  const { user } = useAuth();
  
  const handleSelectConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      markConversationAsRead(conversationId);
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Ahora' : `${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return format(date, 'HH:mm', { locale: es });
    } else {
      return format(date, 'dd/MM', { locale: es });
    }
  };

  const getParticipantInfo = (conversation: any) => {
    // Determinar tipo de conversación basado en los mensajes
    const hasEmergencyKeywords = conversation.messages.some((msg: any) => 
      msg.content.includes('🚨') || 
      msg.content.toLowerCase().includes('urgente') || 
      msg.content.toLowerCase().includes('emergencia')
    );
    
    const hasHospitalKeywords = conversation.messages.some((msg: any) => 
      msg.content.toLowerCase().includes('hospital') || 
      msg.content.toLowerCase().includes('interhospitalario')
    );
    
    const hasDriverKeywords = conversation.messages.some((msg: any) => 
      msg.content.toLowerCase().includes('ambulancia amb-') || 
      msg.content.toLowerCase().includes('servicio anterior')
    );

    if (hasEmergencyKeywords) {
      return { name: 'Emergencias 112', type: 'emergency', avatar: '🚨' };
    } else if (hasHospitalKeywords) {
      return { name: 'Hospital San Carlos', type: 'hospital', avatar: '🏥' };
    } else if (hasDriverKeywords) {
      return { name: 'Equipo Móvil (Miguel)', type: 'driver', avatar: '🚑' };
    } else {
      return { 
        name: user?.role === 'admin' ? 'Usuario Particular' : 'Centro Coordinador', 
        type: 'user', 
        avatar: user?.role === 'admin' ? '👤' : '📞' 
      };
    }
  };

  const getLastMessage = (conversation: any) => {
    if (!conversation || conversation.messages.length === 0) return '';
    
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    let content = lastMessage.content;
    
    // Truncar mensaje si es muy largo
    if (content.length > 60) {
      content = content.substring(0, 60) + '...';
    }
    
    return content;
  };

  const getPriorityLevel = (conversation: any) => {
    const hasEmergency = conversation.messages.some((msg: any) => 
      msg.content.includes('🚨') || 
      msg.content.toLowerCase().includes('urgente') ||
      msg.content.toLowerCase().includes('emergencia') ||
      msg.content.toLowerCase().includes('inmediato')
    );
    
    return hasEmergency ? 'high' : 'normal';
  };

  return (
    <div className="border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="bg-muted p-3 border-b">
        <h3 className="font-medium">Conversaciones</h3>
        <p className="text-sm text-muted-foreground">
          {conversations.length} conversación{conversations.length !== 1 ? 'es' : ''}
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <div className="mb-2">💬</div>
            <p>No hay conversaciones disponibles.</p>
            <p className="text-xs mt-1">Los mensajes aparecerán aquí</p>
          </div>
        ) : (
          <div className="divide-y">
            {conversations
              .sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime())
              .map((conversation) => {
                const participantInfo = getParticipantInfo(conversation);
                const priority = getPriorityLevel(conversation);
                
                return (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    className={cn(
                      'w-full justify-start py-4 px-4 h-auto relative',
                      currentConversation?.id === conversation.id && 'bg-accent',
                      conversation.unreadCount > 0 && 'font-medium bg-blue-50/50',
                      priority === 'high' && 'border-l-4 border-l-red-500'
                    )}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <div className="flex flex-col items-start w-full">
                      <div className="flex justify-between w-full items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{participantInfo.avatar}</span>
                          <span className="font-medium text-sm">
                            {participantInfo.name}
                          </span>
                          {participantInfo.type === 'emergency' && (
                            <Badge variant="destructive" className="text-xs py-0 px-1">
                              URGENTE
                            </Badge>
                          )}
                          {participantInfo.type === 'hospital' && (
                            <Badge variant="secondary" className="text-xs py-0 px-1">
                              HOSPITAL
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(conversation.lastMessageTimestamp)}
                        </span>
                      </div>
                      <div className="flex items-center w-full mt-2">
                        <span className="text-sm text-muted-foreground line-clamp-2 mr-2 text-left">
                          {getLastMessage(conversation)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center ml-auto flex-shrink-0">
                            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Button>
                )
              })
            }
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
