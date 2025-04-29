
import { User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface QuickActionsProps {
  user: User;
  pendingRequestsCount: number;
}

export const QuickActions = ({ user, pendingRequestsCount }: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones rápidas</CardTitle>
        <CardDescription>Opciones comunes según tu rol</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.role === 'hospital' && (
          <Link to="/solicitud" className="w-full">
            <Button className="w-full">
              Nueva solicitud de transporte
            </Button>
          </Link>
        )}
        
        {user.role === 'ambulance' && pendingRequestsCount > 0 && (
          <Link to="/solicitudes?status=pending" className="w-full">
            <Button className="w-full">
              Ver solicitudes pendientes ({pendingRequestsCount})
            </Button>
          </Link>
        )}
        
        {user.role === 'admin' && (
          <Link to="/admin/usuarios" className="w-full">
            <Button variant="outline" className="w-full">
              Gestionar usuarios
            </Button>
          </Link>
        )}
        
        <Link to="/perfil" className="w-full">
          <Button variant="outline" className="w-full">
            Mi perfil
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
