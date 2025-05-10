
import { ChatMessage as ChatMessageType } from '@/types';
import { useAuth } from '@/context/auth';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatMessageProps {
  message: ChatMessageType;
  senderName: string;
}

export const ChatMessage = ({ message, senderName }: ChatMessageProps) => {
  const { user } = useAuth();
  const isOwnMessage = user?.id === message.senderId;
  
  return (
    <div
      className={cn(
        'flex mb-4 max-w-[80%] group',
        isOwnMessage ? 'ml-auto' : 'mr-auto'
      )}
    >
      <div
        className={cn(
          'rounded-lg px-4 py-2 shadow',
          isOwnMessage
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium">
            {isOwnMessage ? 'Tú' : senderName}
          </span>
          <span className="text-xs opacity-70">
            {format(new Date(message.timestamp), 'HH:mm', { locale: es })}
          </span>
        </div>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
};
