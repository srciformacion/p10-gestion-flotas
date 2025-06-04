
import { useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquareTemplate, Send } from 'lucide-react';
import { MessageTemplate } from '@/types/notification';

interface MessageTemplateSelectorProps {
  onSelectTemplate: (message: string) => void;
}

export const MessageTemplateSelector = ({ onSelectTemplate }: MessageTemplateSelectorProps) => {
  const { messageTemplates, createNotificationFromTemplate } = useNotifications();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const availableTemplates = messageTemplates.filter(template => 
    template.roles.includes(user?.role || '')
  );

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setVariables({});
  };

  const handleSendTemplate = () => {
    if (!selectedTemplate) return;

    const message = createNotificationFromTemplate(selectedTemplate.id, variables);
    onSelectTemplate(message);
    setOpen(false);
    setSelectedTemplate(null);
    setVariables({});
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'status_update': return 'bg-blue-100 text-blue-800';
      case 'response': return 'bg-green-100 text-green-800';
      case 'routine': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'emergency': return 'Emergencia';
      case 'status_update': return 'Actualización';
      case 'response': return 'Respuesta';
      case 'routine': return 'Rutina';
      default: return category;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquareTemplate className="h-4 w-4 mr-2" />
          Plantillas
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Plantillas de Mensajes</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {!selectedTemplate ? (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {availableTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge className={getCategoryColor(template.category)}>
                        {getCategoryLabel(template.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.content}
                    </p>
                    {template.variables && template.variables.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {template.variables.map((variable) => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                >
                  ← Volver
                </Button>
                <h3 className="font-medium">{selectedTemplate.name}</h3>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">{selectedTemplate.content}</p>
              </div>

              {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                <div className="space-y-3">
                  <Label>Variables del mensaje:</Label>
                  {selectedTemplate.variables.map((variable) => (
                    <div key={variable}>
                      <Label htmlFor={variable} className="text-sm">
                        {variable}
                      </Label>
                      <Input
                        id={variable}
                        value={variables[variable] || ''}
                        onChange={(e) => 
                          setVariables(prev => ({ ...prev, [variable]: e.target.value }))
                        }
                        placeholder={`Ingrese valor para ${variable}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Vista previa:</h4>
                <div className="p-3 bg-blue-50 rounded-lg border">
                  <p className="text-sm">
                    {createNotificationFromTemplate(selectedTemplate.id, variables)}
                  </p>
                </div>
              </div>

              <Button onClick={handleSendTemplate} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Usar Plantilla
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
