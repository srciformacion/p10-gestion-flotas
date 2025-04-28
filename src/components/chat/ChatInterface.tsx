
import { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { ChatWindow } from './ChatWindow';
import { ConversationList } from './ConversationList';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ChatInterface = () => {
  const { totalUnread } = useChat();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
          {totalUnread > 0 && (
            <span className={cn(
              "absolute top-0 right-0 h-5 w-5 bg-primary text-primary-foreground",
              "rounded-full text-xs font-medium flex items-center justify-center"
            )}>
              {totalUnread}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] sm:w-[500px] p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          <div className="md:col-span-1 border-r hidden md:block">
            <ConversationList />
          </div>
          <div className="md:col-span-2 h-full">
            <ChatWindow onClose={() => setOpen(false)} className="h-full" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
