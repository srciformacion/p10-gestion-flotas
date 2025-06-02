
import { Settings, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ConfigurationPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Settings className="h-8 w-8" />
        Configuración del Sistema
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Nombre de la empresa</Label>
              <Input id="companyName" defaultValue="Central de Ambulancias SA" />
            </div>
            <div>
              <Label htmlFor="contactEmail">Email de contacto</Label>
              <Input id="contactEmail" type="email" defaultValue="contacto@ambulancias.com" />
            </div>
            <div>
              <Label htmlFor="contactPhone">Teléfono de contacto</Label>
              <Input id="contactPhone" defaultValue="+34 900 123 456" />
            </div>
            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" defaultValue="Calle Principal 123, Madrid" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuración Operativa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="responseTime">Tiempo máximo de respuesta (minutos)</Label>
              <Input id="responseTime" type="number" defaultValue="15" />
            </div>
            <div>
              <Label htmlFor="workingHours">Horario de trabajo</Label>
              <div className="flex gap-2">
                <Input placeholder="08:00" />
                <Input placeholder="20:00" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="optimization">Optimización automática de rutas</Label>
              <Switch id="optimization" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notificaciones automáticas</Label>
              <Switch id="notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotif">Notificaciones por email</Label>
              <Switch id="emailNotif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="smsNotif">Notificaciones por SMS</Label>
              <Switch id="smsNotif" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotif">Notificaciones push</Label>
              <Switch id="pushNotif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="inAppNotif">Notificaciones en la app</Label>
              <Switch id="inAppNotif" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
};

export default ConfigurationPage;
