
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, FileText, Settings, Ambulance, BarChart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const menuItems = [
    {
      title: "Gestión de Empresas",
      description: "Administrar empresas y organizaciones",
      icon: Building2,
      href: "/admin/empresas"
    },
    {
      title: "Gestión de Usuarios",
      description: "Administrar usuarios del sistema",
      icon: Users,
      href: "/admin/usuarios"
    },
    {
      title: "Solicitudes",
      description: "Ver todas las solicitudes de transporte",
      icon: FileText,
      href: "/admin/solicitudes"
    },
    {
      title: "Vehículos",
      description: "Gestionar la flota de vehículos",
      icon: Ambulance,
      href: "/admin/vehiculos"
    },
    {
      title: "Seguimiento GPS",
      description: "Ver la ubicación en tiempo real de los vehículos",
      icon: MapPin,
      href: "/admin/tracking"
    },
    {
      title: "Business Intelligence",
      description: "Ver estadísticas y análisis de datos",
      icon: BarChart,
      href: "/admin/bi"
    },
    {
      title: "Configuración",
      description: "Configuración del sistema",
      icon: Settings,
      href: "/admin/configuracion"
    }
  ];

  return (
    <RequireAuth allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Panel de Administración</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <Card key={item.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{item.description}</p>
                    <Button asChild className="w-full">
                      <Link to={item.href}>Acceder</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default AdminDashboard;
