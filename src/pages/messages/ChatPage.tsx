
import { useChat } from "@/context/ChatContext";
import { ConversationList } from "@/components/chat/ConversationList";
import { EnhancedChatWindow } from "@/components/chat/EnhancedChatWindow";
import { AppLayout } from "@/components/layout/AppLayout";

const ChatPage = () => {
  const { currentConversation } = useChat();

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mensajes</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
          <div className="md:col-span-1">
            <ConversationList />
          </div>
          <div className="md:col-span-2 h-full">
            {currentConversation ? (
              <EnhancedChatWindow onClose={() => {}} />
            ) : (
              <div className="flex items-center justify-center h-full border rounded-lg">
                <p className="text-muted-foreground">
                  Selecciona una conversación para comenzar a chatear
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatPage;
