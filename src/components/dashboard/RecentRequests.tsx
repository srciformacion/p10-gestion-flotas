
import { useRequests } from "@/context/RequestsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestCard } from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/requests/EmptyState";

export const RecentRequests = () => {
  const { requests } = useRequests();
  
  // Obtener las solicitudes más recientes (últimas 3)
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    .slice(0, 3);

  // Comprobar si hay solicitudes activas (en camino o asignadas)
  const hasActiveRequests = recentRequests.some(
    request => request.status === 'assigned' || request.status === 'inRoute'
  );
  
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Solicitudes Recientes</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/solicitudes">Ver todas</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentRequests.length > 0 ? (
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
            
            {hasActiveRequests && (
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Puedes compartir el enlace de seguimiento con el paciente o sus familiares
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/solicitudes">
                    Ver todas las solicitudes
                  </Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="Sin solicitudes recientes"
            description="No hay solicitudes de traslado recientes para mostrar."
            action={
              <Button asChild>
                <Link to="/solicitud">Nueva solicitud</Link>
              </Button>
            }
          />
        )}
      </CardContent>
    </Card>
  );
};
