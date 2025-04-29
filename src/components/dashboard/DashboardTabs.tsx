
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types";
import { TransportRequest } from "@/types";
import { RequestsList } from "@/components/dashboard/RequestsList";
import { DashboardOverviewTab } from "@/components/dashboard/tabs/DashboardOverviewTab";
import { AmbulanceVehiclesTab } from "@/components/dashboard/tabs/AmbulanceVehiclesTab";
import { AdminTab } from "@/components/dashboard/tabs/AdminTab";
import { Ambulance, FileText, MapPin } from "lucide-react";

interface DashboardTabsProps {
  user: User;
  requests: TransportRequest[];
  totalRequestsCount: number;
}

export const DashboardTabs = ({ user, requests, totalRequestsCount }: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const pendingRequestsCount = requests.filter(req => req.status === 'pending').length;
  const assignedRequestsCount = requests.filter(req => req.status === 'assigned').length;
  const inRouteRequestsCount = requests.filter(req => req.status === 'inRoute').length;
  const completedRequestsCount = requests.filter(req => req.status === 'completed').length;
  
  // Opciones específicas para empresa de ambulancias
  const ambulanceOptions = [
    {
      title: "Gestión de Vehículos",
      description: "Administrar mi flota de ambulancias",
      icon: Ambulance,
      href: "/vehiculos",
      variant: "default" as "default" | "outline",
    },
    {
      title: "Solicitudes Activas",
      description: "Ver solicitudes asignadas a mi flota",
      icon: FileText,
      href: "/solicitudes?status=assigned",
      variant: "outline" as "default" | "outline",
    },
    {
      title: "Seguimiento GPS",
      description: "Ver la ubicación en tiempo real de mis vehículos",
      icon: MapPin,
      href: "/seguimiento",
      variant: "outline" as "default" | "outline",
    }
  ];
  
  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="requests">Solicitudes</TabsTrigger>
        {user.role === 'ambulance' && <TabsTrigger value="vehicles">Vehículos</TabsTrigger>}
        {user.role === 'admin' && <TabsTrigger value="admin">Administración</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <DashboardOverviewTab 
          pendingRequestsCount={pendingRequestsCount}
          assignedRequestsCount={assignedRequestsCount}
          inRouteRequestsCount={inRouteRequestsCount}
          completedRequestsCount={completedRequestsCount}
          user={user}
        />
      </TabsContent>
      
      <TabsContent value="requests">
        <RequestsList 
          requests={requests}
          totalCount={totalRequestsCount}
          user={user}
        />
      </TabsContent>
      
      {user.role === 'ambulance' && (
        <TabsContent value="vehicles">
          <AmbulanceVehiclesTab options={ambulanceOptions} />
        </TabsContent>
      )}
      
      {user.role === 'admin' && (
        <TabsContent value="admin">
          <AdminTab />
        </TabsContent>
      )}
    </Tabs>
  );
};
