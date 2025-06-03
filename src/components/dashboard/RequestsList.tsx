
import { TransportRequest } from "@/types/request";
import { User } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequestStatusBadge } from "@/components/RequestStatusBadge";
import { Link } from "react-router-dom";

interface RequestsListProps {
  requests: TransportRequest[];
  totalCount: number;
  user: User;
}

export const RequestsList = ({ requests, totalCount, user }: RequestsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Todas las solicitudes</CardTitle>
        <CardDescription>
          {totalCount} 
          {totalCount === 1 ? ' solicitud en total' : ' solicitudes en total'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.length > 0 ? (
            <div className="divide-y">
              {requests.map((request) => (
                <div key={request.id} className="flex justify-between items-center py-3">
                  <div>
                    <div className="font-medium">{request.patientName}</div>
                    <div className="text-sm text-muted-foreground">
                      Origen: {request.origin}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Destino: {request.destination}
                    </div>
                    <div className="mt-1">
                      <RequestStatusBadge status={request.status} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      {new Date(request.dateTime).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: '2-digit',
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </div>
                    <Link to={`/solicitudes/${request.id}`}>
                      <Button variant="link" size="sm" className="px-0">
                        Ver detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay solicitudes para mostrar</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to="/solicitudes">
          <Button variant="outline">Ver todas</Button>
        </Link>
        {user.role === 'hospital' && (
          <Link to="/nueva-solicitud">
            <Button>Nueva solicitud</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};
