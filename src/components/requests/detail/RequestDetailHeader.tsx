
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestStatusBadge } from "@/components/RequestStatusBadge";
import { RequestStatus } from "@/types";

interface RequestDetailHeaderProps {
  id: string;
  dateTime: string;
  status: RequestStatus;
  formatDateTime: (dateTimeStr: string) => string;
}

export const RequestDetailHeader = ({ id, dateTime, status, formatDateTime }: RequestDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Volver
        </Button>
        <h1 className="text-2xl font-bold">Detalles de Solicitud</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-semibold">
            Solicitud #{id}
          </h2>
          <p className="text-sm text-muted-foreground">
            Creada: {formatDateTime(dateTime)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RequestStatusBadge status={status} />
          {(status === 'assigned' || status === 'inRoute') && (
            <Button 
              variant="secondary" 
              size="sm" 
              asChild
              className="gap-1"
            >
              <Link to={`/seguimiento/${id}`}>
                <MapPin className="h-4 w-4" /> 
                Seguimiento
              </Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
