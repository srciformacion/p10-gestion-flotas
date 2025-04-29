
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ambulance, MapPin, Users, Settings, BarChart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * AdminTab component
 * 
 * Provides administrative management options for admin users.
 * Displays a grid of cards for different administrative functions like user management,
 * vehicle fleet management, system configuration, GPS tracking, and business intelligence.
 * 
 * The Business Intelligence option is only displayed for users with the "admin" role.
 */
export const AdminTab = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Panel de Administración</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* User Management Card */}
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
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/usuarios">Gestionar Usuarios</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Vehicle Management Card */}
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
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/vehiculos">Gestionar Vehículos</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* System Configuration Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-500" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Configuración del sistema
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/configuracion">Administrar Configuración</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* GPS Tracking Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              Seguimiento GPS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Ver la ubicación en tiempo real de todos los vehículos
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/tracking">Ver Seguimiento</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Business Intelligence Card - Only visible for admin role */}
        {user?.role === "admin" && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-yellow-500" />
                Business Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ver estadísticas y análisis de datos
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/bi">Ver Análisis</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="mt-6">
        <Button asChild>
          <Link to="/admin/dashboard">Panel de Administración Completo</Link>
        </Button>
      </div>
    </div>
  );
};
