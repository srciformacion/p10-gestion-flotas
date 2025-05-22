
import { useChat } from "@/context/ChatContext";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";

const ChatPage = () => {
  const { currentConversation } = useChat();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar component removed from here, it's handled by the Layout */}
      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Mensajes</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
            <div className="md:col-span-1">
              <ConversationList />
            </div>
            <div className="md:col-span-2 h-full">
              {currentConversation ? (
                <ChatWindow onClose={() => {}} className="h-full" />
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
      </main>
    </div>
  );
};

export default ChatPage;
