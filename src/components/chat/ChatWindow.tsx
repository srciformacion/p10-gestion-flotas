
import { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage } from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, XIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatWindowProps {
  onClose: () => void;
  className?: string;
}

export const ChatWindow = ({ onClose, className }: ChatWindowProps) => {
  const { currentConversation, sendMessage } = useChat();
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
    }
  };
  
  // This would be replaced with real data from an API
  const getParticipantName = (senderId: string) => {
    if (user?.id === senderId) return user.name;
    return user?.role === 'admin' ? 'Usuario' : 'Administrador';
  };

  if (!currentConversation) return null;

  return (
    <div className={cn('flex flex-col h-[500px] shadow-lg rounded-lg', className)}>
      {/* Header */}
      <div className="flex items-center justify-between bg-secondary text-secondary-foreground px-4 py-3 rounded-t-lg">
        <h3 className="text-lg font-medium">
          Chat con {user?.role === 'admin' ? 'Usuario' : 'Administración'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-secondary-foreground">
          <XIcon size={18} />
        </Button>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4 bg-background">
        <div className="flex flex-col space-y-1">
          <div className="text-xs text-center text-muted-foreground py-2">
            {format(new Date(currentConversation.messages[0]?.timestamp || Date.now()), 'PPP', { locale: es })}
          </div>
          
          {currentConversation.messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              senderName={getParticipantName(msg.senderId)} 
            />
          ))}
        </div>
      </ScrollArea>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1"
        />
        <Button type="submit" disabled={!message.trim()}>
          <SendIcon size={18} className="mr-1" />
          Enviar
        </Button>
      </form>
    </div>
  );
};
