
import { useNotifications } from '@/context/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';

export const NotificationPreferences = () => {
  const { preferences, updatePreferences, requestPushPermission } = useNotifications();

  const handleCategoryToggle = (category: keyof typeof preferences.categories) => {
    updatePreferences({
      categories: {
        ...preferences.categories,
        [category]: !preferences.categories[category]
      }
    });
  };

  const handleEnablePush = async () => {
    const granted = await requestPushPermission();
    if (granted) {
      updatePreferences({ pushEnabled: true });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Preferencias de Notificaciones
        </CardTitle>
        <CardDescription>
          Configura cómo y cuándo quieres recibir notificaciones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notificaciones Push */}
        <div className="space-y-4">
          <h4 className="font-medium">Métodos de Notificación</h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notificaciones Push del Navegador</Label>
              <p className="text-sm text-muted-foreground">
                Recibe alertas instantáneas en tu navegador
              </p>
            </div>
            {preferences.pushEnabled ? (
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-green-600" />
                <Switch
                  checked={preferences.pushEnabled}
                  onCheckedChange={(checked) => updatePreferences({ pushEnabled: checked })}
                />
              </div>
            ) : (
              <Button onClick={handleEnablePush} variant="outline" size="sm">
                <BellOff className="h-4 w-4 mr-2" />
                Habilitar
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notificaciones por Email</Label>
              <p className="text-sm text-muted-foreground">
                Recibe resúmenes por correo electrónico
              </p>
            </div>
            <Switch
              checked={preferences.emailEnabled}
              onCheckedChange={(checked) => updatePreferences({ emailEnabled: checked })}
            />
          </div>
        </div>

        {/* Categorías de Notificación */}
        <div className="space-y-4">
          <h4 className="font-medium">Tipos de Notificaciones</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Cambios de Estado de Solicitudes</Label>
                <p className="text-sm text-muted-foreground">
                  Actualizaciones sobre tus solicitudes de transporte
                </p>
              </div>
              <Switch
                checked={preferences.categories.request_status}
                onCheckedChange={() => handleCategoryToggle('request_status')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Mensajes de Chat</Label>
                <p className="text-sm text-muted-foreground">
                  Nuevos mensajes en conversaciones
                </p>
              </div>
              <Switch
                checked={preferences.categories.chat}
                onCheckedChange={() => handleCategoryToggle('chat')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Notificaciones del Sistema</Label>
                <p className="text-sm text-muted-foreground">
                  Actualizaciones importantes del sistema
                </p>
              </div>
              <Switch
                checked={preferences.categories.system}
                onCheckedChange={() => handleCategoryToggle('system')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Mantenimiento y Actualizaciones</Label>
                <p className="text-sm text-muted-foreground">
                  Información sobre mantenimiento programado
                </p>
              </div>
              <Switch
                checked={preferences.categories.maintenance}
                onCheckedChange={() => handleCategoryToggle('maintenance')}
              />
            </div>
          </div>
        </div>

        {/* Configuración Avanzada */}
        <div className="space-y-4">
          <h4 className="font-medium">Configuración Avanzada</h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Solo Notificaciones Urgentes</Label>
              <p className="text-sm text-muted-foreground">
                Recibir únicamente notificaciones de alta prioridad
              </p>
            </div>
            <Switch
              checked={preferences.urgentOnly}
              onCheckedChange={(checked) => updatePreferences({ urgentOnly: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
