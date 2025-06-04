
import { useNotifications } from "@/context/NotificationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const NotificationPreferences = () => {
  const { preferences, updatePreferences, requestNotificationPermission } = useNotifications();

  const handlePermissionRequest = async () => {
    await requestNotificationPermission();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferencias de Notificaciones</CardTitle>
          <CardDescription>
            Configura cómo y cuándo quieres recibir notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuración General */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Notificaciones Push</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir notificaciones en tiempo real en el navegador
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="push-notifications"
                  checked={preferences.pushEnabled}
                  onCheckedChange={(checked) => 
                    updatePreferences({ pushEnabled: checked })
                  }
                />
                {!preferences.pushEnabled && (
                  <Button variant="outline" size="sm" onClick={handlePermissionRequest}>
                    Activar
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir resúmenes y actualizaciones por correo electrónico
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.emailEnabled}
                onCheckedChange={(checked) => 
                  updatePreferences({ emailEnabled: checked })
                }
              />
            </div>
          </div>

          {/* Categorías de Notificaciones */}
          <div className="space-y-4">
            <h4 className="font-medium">Tipos de Notificaciones</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="request-status">Cambios de Estado de Solicitudes</Label>
                <p className="text-sm text-muted-foreground">
                  Cuando una solicitud cambia de estado
                </p>
              </div>
              <Switch
                id="request-status"
                checked={preferences.requestStatusChanges}
                onCheckedChange={(checked) => 
                  updatePreferences({ requestStatusChanges: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="vehicle-assignments">Asignaciones de Vehículos</Label>
                <p className="text-sm text-muted-foreground">
                  Cuando se asigna o reasigna un vehículo
                </p>
              </div>
              <Switch
                id="vehicle-assignments"
                checked={preferences.vehicleAssignments}
                onCheckedChange={(checked) => 
                  updatePreferences({ vehicleAssignments: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emergency-alerts">Alertas de Emergencia</Label>
                <p className="text-sm text-muted-foreground">
                  Notificaciones críticas y de emergencia
                </p>
              </div>
              <Switch
                id="emergency-alerts"
                checked={preferences.emergencyAlerts}
                onCheckedChange={(checked) => 
                  updatePreferences({ emergencyAlerts: checked })
                }
              />
            </div>
          </div>

          {/* Horario Silencioso */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quiet-hours">Horario Silencioso</Label>
                <p className="text-sm text-muted-foreground">
                  No recibir notificaciones durante estas horas (excepto emergencias)
                </p>
              </div>
              <Switch
                id="quiet-hours"
                checked={preferences.quietHours.enabled}
                onCheckedChange={(checked) => 
                  updatePreferences({ 
                    quietHours: { ...preferences.quietHours, enabled: checked }
                  })
                }
              />
            </div>

            {preferences.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Hora de inicio</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={preferences.quietHours.start}
                    onChange={(e) => 
                      updatePreferences({
                        quietHours: { 
                          ...preferences.quietHours, 
                          start: e.target.value 
                        }
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">Hora de fin</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={preferences.quietHours.end}
                    onChange={(e) => 
                      updatePreferences({
                        quietHours: { 
                          ...preferences.quietHours, 
                          end: e.target.value 
                        }
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
