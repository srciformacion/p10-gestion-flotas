
import { Ambulance } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ambulance as AmbulanceIcon } from "lucide-react";

interface AmbulanceDetailsProps {
  ambulance: Ambulance;
}

export const AmbulanceDetails = ({ ambulance }: AmbulanceDetailsProps) => {
  const getStatusStyle = (status: Ambulance["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-300";
      case "busy":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "maintenance":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <AmbulanceIcon className="h-4 w-4" />
          Detalles de la Ambulancia ({ambulance.id})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-gray-500">Modelo</p>
            <p>{ambulance.model}</p>
          </div>
          <div>
            <p className="text-gray-500">Matrícula</p>
            <p>{ambulance.licensePlate}</p>
          </div>
          <div>
            <p className="text-gray-500">Ubicación base</p>
            <p>{ambulance.baseLocation}</p>
          </div>
          <div>
            <p className="text-gray-500">Estado</p>
            <Badge variant="outline" className={getStatusStyle(ambulance.status)}>
              {ambulance.status === "available"
                ? "Disponible"
                : ambulance.status === "busy"
                ? "Asignada"
                : "En mantenimiento"}
            </Badge>
          </div>
          <div>
            <p className="text-gray-500">Capacidad</p>
            <p>
              {ambulance.stretcherSeats} camilla,{" "}
              {ambulance.wheelchairSeats} silla,{" "}
              {ambulance.walkingSeats} sentados
            </p>
          </div>
          <div>
            <p className="text-gray-500">Equipamiento</p>
            <p>{ambulance.equipment.join(", ") || "Ninguno"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
