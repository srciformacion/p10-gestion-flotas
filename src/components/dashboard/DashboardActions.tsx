
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
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Acción: Crear nueva solicitud */}
        {canCreateRequest && (
          <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-rioja-green">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-rioja-blue">
                <Plus className="h-6 w-6 text-rioja-green" />
                Nueva Solicitud
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Crear una nueva solicitud de transporte sanitario de forma rápida y sencilla
              </p>
              <Link to="/nueva-solicitud" className="w-full">
                <Button className="w-full bg-rioja-green hover:bg-rioja-green/90 h-11 font-medium">
                  Crear Solicitud
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Acción: Ver todas las solicitudes */}
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-rioja-blue">
              <FileText className="h-6 w-6 text-orange-500" />
              Solicitudes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Ver y gestionar todas las solicitudes de transporte en el sistema
            </p>
            <Link to="/solicitudes" className="w-full">
              <Button variant="outline" className="w-full h-11 font-medium border-orange-500 text-orange-600 hover:bg-orange-50">
                Ver Solicitudes
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Acción: Mensajes */}
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-rioja-blue">
              <MessageCircle className="h-6 w-6 text-blue-500" />
              Mensajes
              {totalUnread > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                  {totalUnread}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Comunícate con {user?.role === 'admin' || user?.role === 'ambulance' ? 'los usuarios del sistema' : 'la administración'}
            </p>
            <Link to="/mensajes" className="w-full">
              <Button variant="outline" className="w-full h-11 font-medium border-blue-500 text-blue-600 hover:bg-blue-50">
                Ver Mensajes
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Acción: Gestionar usuarios (admin y ambulancias) */}
        {canManageUsers && (
          <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-rioja-blue">
                <Users className="h-6 w-6 text-purple-500" />
                Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Gestionar los usuarios del sistema y sus permisos
              </p>
              <Link to="/usuarios" className="w-full">
                <Button variant="outline" className="w-full h-11 font-medium border-purple-500 text-purple-600 hover:bg-purple-50">
                  Gestionar Usuarios
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Acción: Gestionar vehículos (admin y ambulancias) */}
        {canManageVehicles && (
          <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-rioja-green">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-rioja-blue">
                <Ambulance className="h-6 w-6 text-rioja-green" />
                Ambulancias
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Gestionar la flota de vehículos disponibles y su estado
              </p>
              <Link to="/ambulancias" className="w-full">
                <Button variant="outline" className="w-full h-11 font-medium border-rioja-green text-rioja-green hover:bg-rioja-green/10">
                  Gestionar Ambulancias
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
