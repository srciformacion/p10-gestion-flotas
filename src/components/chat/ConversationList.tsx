
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    const isToday = date.getDate() === now.getDate() && 
                   date.getMonth() === now.getMonth() && 
                   date.getFullYear() === now.getFullYear();
    
    return isToday 
      ? format(date, 'HH:mm', { locale: es })
      : format(date, 'dd/MM', { locale: es });
  };

  // For now, we'll use placeholder logic to get names
  // In a real implementation, this would come from the API
  const getParticipantName = (conversationId: string) => {
    return user?.role === 'admin' ? 'Usuario' : 'Administración';
  };

  const getLastMessage = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation || conversation.messages.length === 0) return '';
    
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.content.length > 30
      ? lastMessage.content.substring(0, 30) + '...'
      : lastMessage.content;
  };

  return (
    <div className="border rounded-lg overflow-hidden h-[500px] flex flex-col">
      <div className="bg-muted p-3 border-b">
        <h3 className="font-medium">Conversaciones</h3>
      </div>
      
      <ScrollArea className="flex-1">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No hay conversaciones disponibles.
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className={cn(
                  'w-full justify-start py-3 px-4 h-auto',
                  currentConversation?.id === conversation.id && 'bg-accent',
                  conversation.unreadCount > 0 && 'font-medium'
                )}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="flex flex-col items-start w-full">
                  <div className="flex justify-between w-full">
                    <span className="font-medium">
                      {getParticipantName(conversation.id)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(conversation.lastMessageTimestamp)}
                    </span>
                  </div>
                  <div className="flex items-center w-full mt-1">
                    <span className="text-sm text-muted-foreground line-clamp-1 mr-2">
                      {getLastMessage(conversation.id)}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
