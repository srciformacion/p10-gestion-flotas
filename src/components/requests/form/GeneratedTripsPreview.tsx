
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TransportType, TripType, ServiceType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { AdvancedRequestFormData, GeneratedTrip } from "@/hooks/useAdvancedRequestForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

interface GeneratedTripsPreviewProps {
  trips: GeneratedTrip[];
  isLoading: boolean;
  formData: AdvancedRequestFormData;
}

export const GeneratedTripsPreview = ({ trips, isLoading, formData }: GeneratedTripsPreviewProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-12">
        <Spinner />
        <p className="mt-4 text-muted-foreground">Generando traslados...</p>
      </div>
    );
  }
  
  if (trips.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No hay traslados generados. Pulse "Actualizar vista previa" para ver los traslados que se crearán.
        </AlertDescription>
      </Alert>
    );
  }

  const formatTripDate = (date: string) => {
    return format(new Date(date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  };
  
  const formatTripTime = (time: string) => {
    return format(new Date(`2000-01-01T${time}`), "HH:mm", { locale: es });
  };
  
  const getServiceTypeLabel = (type: ServiceType) => {
    const types = {
      consultation: "Consulta",
      admission: "Ingreso",
      discharge: "Alta",
      transfer: "Traslado"
    };
    return types[type];
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="p-4 bg-muted/50">
          <h4 className="font-medium mb-2">Resumen</h4>
          <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
            <div className="flex justify-between sm:block">
              <dt className="text-muted-foreground">Total de traslados:</dt>
              <dd className="font-medium">{trips.length}</dd>
            </div>
            <div className="flex justify-between sm:block">
              <dt className="text-muted-foreground">Tipo:</dt>
              <dd className="font-medium">{getServiceTypeLabel(formData.serviceType)}</dd>
            </div>
            <div className="flex justify-between sm:block">
              <dt className="text-muted-foreground">Transporte:</dt>
              <dd className="font-medium">
                {formData.transportType === 'stretcher' && 'Camilla'}
                {formData.transportType === 'wheelchair' && 'Silla de ruedas'}
                {formData.transportType === 'walking' && 'Andando'}
              </dd>
            </div>
          </dl>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Origen</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.slice(0, 10).map((trip, index) => (
              <TableRow key={index}>
                <TableCell className="capitalize">{formatTripDate(trip.date)}</TableCell>
                <TableCell>{formatTripTime(trip.time)}</TableCell>
                <TableCell>{formData.origin}</TableCell>
                <TableCell>{formData.destination}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {trip.isReturn ? "Vuelta" : "Ida"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {trips.length > 10 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Mostrando 10 de {trips.length} traslados
          </div>
        )}
      </div>
      
      <div className="rounded-md bg-blue-50 border border-blue-200 p-4 text-blue-700 text-sm">
        <p>
          Se crearán un total de <strong>{trips.length} traslados</strong> basados en la configuración especificada.
          Cada traslado podrá ser gestionado individualmente una vez creados.
        </p>
      </div>
    </div>
  );
};
