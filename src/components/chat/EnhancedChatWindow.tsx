
import { useState, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage } from './ChatMessage';
import { MessageTemplateSelector } from './MessageTemplateSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, XIcon, Paperclip, Smile } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EnhancedChatWindowProps {
  onClose: () => void;
  className?: string;
}

export const EnhancedChatWindow = ({ onClose, className }: EnhancedChatWindowProps) => {
  const { currentConversation, sendMessage } = useChat();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  const handleTemplateSelect = (templateMessage: string) => {
    setMessage(templateMessage);
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aquí se implementaría la subida de archivos
      console.log('Archivo seleccionado:', file.name);
      // Por ahora solo añadimos un mensaje indicando el archivo
      sendMessage(`📎 Archivo adjunto: ${file.name}`);
    }
  };

  // Simular indicador de "escribiendo"
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Simular que alguien está escribiendo
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  const getParticipantName = (senderId: string) => {
    if (user?.id === senderId) return user.name;
    return user?.role === 'admin' ? 'Usuario' : 'Administrador';
  };

  if (!currentConversation) return null;

  return (
    <div className={cn('flex flex-col h-[600px] shadow-lg rounded-lg border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between bg-primary text-primary-foreground px-4 py-3 rounded-t-lg">
        <div>
          <h3 className="text-lg font-medium">
            Chat con {user?.role === 'admin' ? 'Usuario' : 'Administración'}
          </h3>
          {isTyping && (
            <p className="text-sm opacity-75">
              Escribiendo...
            </p>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/20">
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
          
          {isTyping && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>Escribiendo...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick actions */}
      <div className="border-t px-4 py-2 bg-muted/30">
        <div className="flex gap-2">
          <MessageTemplateSelector onSelectTemplate={handleTemplateSelect} />
          <Button variant="outline" size="sm" onClick={handleFileAttach}>
            <Paperclip className="h-4 w-4 mr-2" />
            Adjuntar
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2 bg-background rounded-b-lg">
        <Input
          value={message}
          onChange={handleInputChange}
          placeholder="Escribe un mensaje..."
          className="flex-1"
        />
        <Button type="button" variant="ghost" size="icon">
          <Smile size={18} />
        </Button>
        <Button type="submit" disabled={!message.trim()}>
          <SendIcon size={18} className="mr-1" />
          Enviar
        </Button>
      </form>
    </div>
  );
};
