
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
  const canManageUsers = user?.role === 'admin' || user?.role === 'ambulance';
  const canManageVehicles = user?.role === 'admin' || user?.role === 'ambulance';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Acción: Crear nueva solicitud */}
      {canCreateRequest && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-rioja-green" />
              Nueva Solicitud
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm mb-4">
              Crear una nueva solicitud de transporte sanitario
            </p>
            <Link to="/nueva-solicitud" className="w-full">
              <Button className="w-full bg-rioja-green hover:bg-rioja-green/90">
                Crear Solicitud
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Acción: Ver todas las solicitudes */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-orange-500" />
            Solicitudes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm mb-4">
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
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Mensajes
            {totalUnread > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalUnread}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm mb-4">
            Comunícate con {user?.role === 'admin' || user?.role === 'ambulance' ? 'los usuarios' : 'la administración'}
          </p>
          <Link to="/mensajes" className="w-full">
            <Button variant="outline" className="w-full">
              Ver Mensajes
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Acción: Gestionar usuarios (admin y ambulancias) */}
      {canManageUsers && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-blue-500" />
              Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm mb-4">
              Gestionar los usuarios del sistema
            </p>
            <Link to="/usuarios" className="w-full">
              <Button variant="outline" className="w-full">
                Gestionar Usuarios
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Acción: Gestionar vehículos (admin y ambulancias) */}
      {canManageVehicles && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ambulance className="h-5 w-5 text-rioja-green" />
              Ambulancias
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm mb-4">
              Gestionar la flota de vehículos disponibles
            </p>
            <Link to="/ambulancias" className="w-full">
              <Button variant="outline" className="w-full">
                Gestionar Ambulancias
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
