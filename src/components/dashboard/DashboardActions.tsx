
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ambulance, FileText, MessageCircle, Plus, Users } from "lucide-react";
import { useChat } from "@/context/ChatContext";

interface DashboardActionsProps {
  user: User;
}

export const DashboardActions = ({ user }: DashboardActionsProps) => {
  const { totalUnread } = useChat();
  
  // Definimos las acciones disponibles según el rol del usuario
  const canCreateRequest = user?.role === 'hospital' || user?.role === 'individual' || user?.role === 'admin';
  const canManageRequests = user?.role === 'admin';
  const canManageUsers = user?.role === 'admin';
  const canManageVehicles = user?.role === 'admin';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Acción: Crear nueva solicitud */}
      {canCreateRequest && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Nueva Solicitud
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Crear una nueva solicitud de transporte sanitario
            </p>
            <Link to="/solicitud" className="w-full">
              <Button className="w-full">
                Crear Solicitud
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Acción: Ver todas las solicitudes */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
            Solicitudes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Ver y gestionar todas las solicitudes de transporte
          </p>
          <Link to="/solicitudes" className="w-full">
            <Button variant="outline" className="w-full">
              Ver Solicitudes
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Acción: Mensajes */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Mensajes
            {totalUnread > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalUnread}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Comunícate con {user?.role === 'admin' ? 'los usuarios' : 'la administración'}
          </p>
          <Link to="/mensajes" className="w-full">
            <Button variant="outline" className="w-full">
              Ver Mensajes
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Acción: Gestionar usuarios (solo admin) */}
      {canManageUsers && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Gestionar los usuarios del sistema
            </p>
            <Link to="/admin/usuarios" className="w-full">
              <Button variant="outline" className="w-full">
                Gestionar Usuarios
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Acción: Gestionar vehículos (solo admin) */}
      {canManageVehicles && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ambulance className="h-5 w-5 text-green-500" />
              Vehículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Gestionar la flota de vehículos disponibles
            </p>
            <Link to="/admin/vehiculos" className="w-full">
              <Button variant="outline" className="w-full">
                Gestionar Vehículos
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
