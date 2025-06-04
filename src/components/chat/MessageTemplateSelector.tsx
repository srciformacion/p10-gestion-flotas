import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquareText, Search, Clock, Heart, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MessageTemplate } from "@/types/message";

const messageTemplates: MessageTemplate[] = [
  {
    id: '1',
    title: 'Saludo inicial',
    content: 'Hola, soy {nombre} del equipo de AmbulLink. ¿En qué puedo ayudarte?',
    category: 'greeting',
    tags: ['saludo', 'inicial']
  },
  {
    id: '2',
    title: 'Solicitud recibida',
    content: 'Hemos recibido tu solicitud de transporte. El número de referencia es {numero_solicitud}. Te mantendremos informado sobre el estado.',
    category: 'status',
    tags: ['confirmación', 'recibida']
  },
  {
    id: '3',
    title: 'Ambulancia asignada',
    content: 'Se ha asignado la ambulancia {vehiculo} a tu solicitud. Tiempo estimado de llegada: {eta}.',
    category: 'status',
    tags: ['asignación', 'eta']
  },
  {
    id: '4',
    title: 'En camino',
    content: 'La ambulancia {vehiculo} está en camino a tu ubicación. Llegada estimada: {eta}.',
    category: 'status',
    tags: ['en_camino', 'llegada']
  },
  {
    id: '5',
    title: 'Emergencia - Prioridad alta',
    content: 'Esta es una situación de emergencia. Hemos priorizado tu solicitud y el equipo más cercano se dirige a tu ubicación.',
    category: 'emergency',
    tags: ['emergencia', 'prioridad']
  },
  {
    id: '6',
    title: 'Solicitar información adicional',
    content: 'Para procesar tu solicitud necesitamos información adicional. ¿Podrías proporcionarnos {informacion_requerida}?',
    category: 'info',
    tags: ['información', 'datos']
  },
  {
    id: '7',
    title: 'Servicio completado',
    content: 'El servicio ha sido completado exitosamente. Gracias por confiar en AmbulLink. ¿Hay algo más en lo que podamos ayudarte?',
    category: 'closing',
    tags: ['completado', 'gracias']
  },
  {
    id: '8',
    title: 'Demora en el servicio',
    content: 'Lamentamos informarte que hay una demora en el servicio debido a {razon}. Nuevo tiempo estimado: {nuevo_eta}.',
    category: 'status',
    tags: ['demora', 'disculpas']
  }
];

interface MessageTemplateSelectorProps {
  onSelectTemplate: (template: MessageTemplate) => void;
  onClose: () => void;
  trigger?: React.ReactNode;
}

export const MessageTemplateSelector = ({ onSelectTemplate, onClose, trigger }: MessageTemplateSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTemplates = messageTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'greeting': return <MessageSquareText className="h-4 w-4" />;
      case 'status': return <Clock className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'closing': return <Heart className="h-4 w-4" />;
      case 'info': return <Search className="h-4 w-4" />;
      default: return <MessageSquareText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'greeting': return 'bg-blue-100 text-blue-800';
      case 'status': return 'bg-yellow-100 text-yellow-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'closing': return 'bg-green-100 text-green-800';
      case 'info': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectTemplate = (template: MessageTemplate) => {
    onSelectTemplate(template);
    onClose();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MessageSquareText className="h-4 w-4 mr-2" />
            Plantillas
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Plantillas de Mensajes</DialogTitle>
          <DialogDescription>
            Selecciona una plantilla para usar como base en tu mensaje
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Búsqueda y filtros */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar plantillas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Todas las categorías</option>
              <option value="greeting">Saludo</option>
              <option value="status">Estado</option>
              <option value="emergency">Emergencia</option>
              <option value="info">Información</option>
              <option value="closing">Cierre</option>
            </select>
          </div>

          {/* Lista de plantillas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      {getCategoryIcon(template.category)}
                      {template.title}
                    </CardTitle>
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs line-clamp-3">
                    {template.content}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron plantillas que coincidan con tu búsqueda
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
