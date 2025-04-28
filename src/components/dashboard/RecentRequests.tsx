
import { TransportRequest } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequestStatusBadge } from "@/components/RequestStatusBadge";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface RecentRequestsProps {
  requests: TransportRequest[];
}

export const RecentRequests = ({ requests }: RecentRequestsProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Solicitudes recientes</CardTitle>
        <CardDescription>
          {requests.length > 0 
            ? `${requests.length} ${requests.length === 1 ? 'solicitud reciente' : 'solicitudes recientes'}`
            : 'No hay solicitudes recientes'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <div className="font-medium">{request.patientName}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(request.dateTime).toLocaleDateString('es-ES', { 
                      day: '2-digit', 
                      month: '2-digit',
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="mt-1">
                    <RequestStatusBadge status={request.status} />
                  </div>
                </div>
                <Link to={`/solicitudes/${request.id}`}>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No hay solicitudes recientes</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link to="/solicitudes" className="w-full">
          <Button variant="outline" className="w-full">
            Ver todas las solicitudes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
