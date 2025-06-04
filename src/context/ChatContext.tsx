
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, Conversation } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

// Datos más realistas para el sistema de mensajes
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participantIds: ['admin-id', 'user1'],
    messages: [
      {
        id: '1',
        senderId: 'admin-id',
        content: 'Hola, buen día. ¿En qué podemos ayudarle hoy?',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        read: true
      },
      {
        id: '2',
        senderId: 'user1',
        content: 'Buenos días, necesito consultar sobre mi solicitud de traslado para mañana a las 10:00h. Es para llevar a mi padre al Hospital La Paz.',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        read: true
      },
      {
        id: '3',
        senderId: 'admin-id',
        content: 'Por supuesto, ¿me puede facilitar el número de solicitud o su DNI para localizar el servicio?',
        timestamp: new Date(Date.now() - 3400000).toISOString(),
        read: true
      },
      {
        id: '4',
        senderId: 'user1',
        content: 'Claro, mi DNI es 12345678X y la solicitud es la número SOL-2024-001234',
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        read: true
      },
      {
        id: '5',
        senderId: 'admin-id',
        content: 'Perfecto, veo su solicitud. El traslado está confirmado para mañana 04/06 a las 10:00h. La ambulancia llegará entre 09:45-09:55h. ¿La dirección sigue siendo C/ Mayor 123?',
        timestamp: new Date(Date.now() - 3200000).toISOString(),
        read: true
      },
      {
        id: '6',
        senderId: 'user1',
        content: 'Sí, esa es la dirección correcta. ¿Podría confirmarme el teléfono de contacto del conductor por si hay algún imprevisto?',
        timestamp: new Date(Date.now() - 180000).toISOString(), // 3 minutos atrás
        read: false
      }
    ],
    lastMessageTimestamp: new Date(Date.now() - 180000).toISOString(),
    unreadCount: 1
  },
  {
    id: '2',
    participantIds: ['admin-id', 'hospital-user'],
    messages: [
      {
        id: '1',
        senderId: 'hospital-user',
        content: 'Urgente: Necesitamos ambulancia para traslado interhospitalario INMEDIATO. Paciente en estado crítico.',
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutos atrás
        read: true
      },
      {
        id: '2',
        senderId: 'admin-id',
        content: 'Recibido. ¿Hospital de origen y destino? ¿Tipo de paciente y patología?',
        timestamp: new Date(Date.now() - 570000).toISOString(),
        read: true
      },
      {
        id: '3',
        senderId: 'hospital-user',
        content: 'Origen: H. Clínico San Carlos. Destino: H. Ramón y Cajal. Paciente masculino 45 años, IAM con complicaciones. Necesita soporte vital.',
        timestamp: new Date(Date.now() - 540000).toISOString(),
        read: true
      },
      {
        id: '4',
        senderId: 'admin-id',
        content: 'Ambulancia SVA-03 activada. ETA 8 minutos. Equipo médico: Dr. Martínez y enfermera Lucía. Contacto directo: 600-URGENCIAS',
        timestamp: new Date(Date.now() - 480000).toISOString(),
        read: true
      },
      {
        id: '5',
        senderId: 'hospital-user',
        content: 'Recibido. Paciente preparado en UVI para traslado. Gracias por la rapidez.',
        timestamp: new Date(Date.now() - 420000).toISOString(),
        read: true
      },
      {
        id: '6',
        senderId: 'admin-id',
        content: 'Ambulancia ha llegado al hospital. Iniciando traslado en 2 minutos. Les mantenemos informados.',
        timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutos atrás
        read: false
      }
    ],
    lastMessageTimestamp: new Date(Date.now() - 120000).toISOString(),
    unreadCount: 1
  },
  {
    id: '3',
    participantIds: ['admin-id', 'driver-user'],
    messages: [
      {
        id: '1',
        senderId: 'driver-user',
        content: 'Buenas tardes, soy Miguel de la ambulancia AMB-15. Hemos terminado el servicio anterior y estamos disponibles para nuevas asignaciones.',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutos atrás
        read: true
      },
      {
        id: '2',
        senderId: 'admin-id',
        content: 'Perfecto Miguel. Tenéis un nuevo servicio: Recogida en Residencia Los Olivos, traslado a consultas Hospital 12 de Octubre.',
        timestamp: new Date(Date.now() - 1740000).toISOString(),
        read: true
      },
      {
        id: '3',
        senderId: 'driver-user',
        content: 'Recibido. ¿Hora de recogida? ¿Alguna indicación especial del paciente?',
        timestamp: new Date(Date.now() - 1680000).toISOString(),
        read: true
      },
      {
        id: '4',
        senderId: 'admin-id',
        content: 'Recogida a las 16:30h (en 15 min). Paciente: Sra. Carmen, 78 años, silla de ruedas. Cita traumatología 17:15h. Sin urgencia.',
        timestamp: new Date(Date.now() - 1620000).toISOString(),
        read: true
      },
      {
        id: '5',
        senderId: 'driver-user',
        content: 'Perfecto, ya vamos hacia allí. ETA residencia 10 minutos.',
        timestamp: new Date(Date.now() - 1560000).toISOString(),
        read: true
      }
    ],
    lastMessageTimestamp: new Date(Date.now() - 1560000).toISOString(),
    unreadCount: 0
  },
  {
    id: '4',
    participantIds: ['admin-id', 'family-user'],
    messages: [
      {
        id: '1',
        senderId: 'family-user',
        content: 'Hola, soy María González. Mi madre tiene cita mañana en el hospital y necesitamos cancelar el transporte que teníamos reservado.',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
        read: true
      },
      {
        id: '2',
        senderId: 'admin-id',
        content: 'Hola María, sin problema. ¿Me puede proporcionar el número de reserva o el DNI de su madre para localizar el servicio?',
        timestamp: new Date(Date.now() - 7140000).toISOString(),
        read: true
      },
      {
        id: '3',
        senderId: 'family-user',
        content: 'El DNI es 87654321Y, nombre Carmen González. La cita era para mañana a las 09:30 en Hospital Gregorio Marañón.',
        timestamp: new Date(Date.now() - 7080000).toISOString(),
        read: true
      },
      {
        id: '4',
        senderId: 'admin-id',
        content: 'Localizado el servicio SOL-2024-001187. Traslado cancelado correctamente. No se aplicará ningún cargo. ¿Todo bien con su madre?',
        timestamp: new Date(Date.now() - 7020000).toISOString(),
        read: true
      },
      {
        id: '5',
        senderId: 'family-user',
        content: 'Sí, gracias. Al final la cita se ha pospuesto una semana. ¿Podríamos reservar para el día 11 a la misma hora?',
        timestamp: new Date(Date.now() - 6960000).toISOString(),
        read: true
      },
      {
        id: '6',
        senderId: 'admin-id',
        content: 'Por supuesto. Nueva reserva creada para el 11/06 a las 09:30h. Confirmación: SOL-2024-001234. ¿Misma dirección de recogida?',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutos atrás
        read: false
      }
    ],
    lastMessageTimestamp: new Date(Date.now() - 300000).toISOString(),
    unreadCount: 1
  },
  {
    id: '5',
    participantIds: ['admin-id', 'emergency-user'],
    messages: [
      {
        id: '1',
        senderId: 'emergency-user',
        content: '🚨 EMERGENCIA 🚨 Accidente de tráfico en A-6 km 15. Múltiples víctimas. Necesitamos todas las ambulancias disponibles.',
        timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutos atrás
        read: true
      },
      {
        id: '2',
        senderId: 'admin-id',
        content: 'ACTIVACIÓN INMEDIATA: Enviamos AMB-01, AMB-05, SVA-02 y SVA-04. ETA 12 minutos. Coordinando con bomberos y policía.',
        timestamp: new Date(Date.now() - 840000).toISOString(),
        read: true
      },
      {
        id: '3',
        senderId: 'emergency-user',
        content: 'Recibido. Tenemos 3 heridos graves y 2 leves. Necesitamos traslado a hospitales diferentes según gravedad.',
        timestamp: new Date(Date.now() - 780000).toISOString(),
        read: true
      },
      {
        id: '4',
        senderId: 'admin-id',
        content: 'Graves → La Paz (2) y Clínico (1). Leves → Hospital de Móstoles. Helicóptero activado para traslado crítico.',
        timestamp: new Date(Date.now() - 720000).toISOString(),
        read: true
      },
      {
        id: '5',
        senderId: 'emergency-user',
        content: 'Primera ambulancia en escena. Iniciando valoración y estabilización. Actualizo en 5 minutos.',
        timestamp: new Date(Date.now() - 660000).toISOString(),
        read: true
      }
    ],
    lastMessageTimestamp: new Date(Date.now() - 660000).toISOString(),
    unreadCount: 0
  }
];

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  totalUnread: number;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Simular carga de conversaciones según el rol del usuario
    if (user) {
      if (user.role === 'admin') {
        // Los admins ven todas las conversaciones
        setConversations(MOCK_CONVERSATIONS);
      } else {
        // Los usuarios regulares solo ven sus conversaciones
        const userConversations = MOCK_CONVERSATIONS.filter(
          (conversation) => conversation.participantIds.includes(user.id)
        );
        setConversations(userConversations);
      }
    }
  }, [user]);

  const sendMessage = (content: string) => {
    if (!currentConversation || !user) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedConversation: Conversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
      lastMessageTimestamp: newMessage.timestamp,
      unreadCount: user.role === 'admin' ? 0 : currentConversation.unreadCount + 1
    };

    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === currentConversation.id ? updatedConversation : conv
      )
    );
    setCurrentConversation(updatedConversation);

    // Simular respuesta automática después de un delay realista
    setTimeout(() => {
      simulateAutoResponse(updatedConversation);
    }, Math.random() * 3000 + 2000); // Entre 2-5 segundos

    toast({
      title: "Mensaje enviado",
      description: "Su mensaje ha sido enviado correctamente"
    });
  };

  const simulateAutoResponse = (conversation: Conversation) => {
    if (!user) return;

    const responses = [
      "Recibido, revisando la información...",
      "Un momento por favor, consultando con el equipo.",
      "Entendido, le respondo en breve.",
      "Verificando los datos en el sistema...",
      "Gracias por la información, procesando su solicitud.",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const autoMessage: ChatMessage = {
      id: `auto_${Date.now()}`,
      senderId: user.role === 'admin' ? 'user-system' : 'admin-id',
      content: randomResponse,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedConversation: Conversation = {
      ...conversation,
      messages: [...conversation.messages, autoMessage],
      lastMessageTimestamp: autoMessage.timestamp,
      unreadCount: conversation.unreadCount + 1
    };

    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversation.id ? updatedConversation : conv
      )
    );

    if (currentConversation?.id === conversation.id) {
      setCurrentConversation(updatedConversation);
    }
  };

  const markConversationAsRead = (conversationId: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map((msg) => ({ ...msg, read: true }))
          };
        }
        return conv;
      })
    );

    if (currentConversation?.id === conversationId) {
      setCurrentConversation({
        ...currentConversation,
        unreadCount: 0,
        messages: currentConversation.messages.map((msg) => ({ ...msg, read: true }))
      });
    }
  };

  const totalUnread = conversations.reduce(
    (total, conv) => total + conv.unreadCount,
    0
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        setCurrentConversation,
        sendMessage,
        markConversationAsRead,
        totalUnread,
        isTyping,
        setIsTyping
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
