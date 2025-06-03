
import { Button } from "@/components/ui/button";
import { RequestStatus } from "@/types/request";
import { Ambulance, CalendarCheck, Clock, FileText, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusFilterProps {
  currentStatus: RequestStatus | "all";
  onStatusChange: (status: RequestStatus | "all") => void;
}

export const StatusFilter = ({ currentStatus, onStatusChange }: StatusFilterProps) => {
  const getStatusBadge = (status: RequestStatus | "all", count?: number) => {
    const baseClasses = "transition-all duration-200";
    
    switch (status) {
      case "all":
        return (
          <Badge 
            className={`${baseClasses} ${currentStatus === "all" ? "bg-rioja-blue text-rioja-white" : "bg-gray-100 text-gray-700 hover:bg-rioja-blue/20"}`}
          >
            Todas
          </Badge>
        );
      case "pending":
        return (
          <Badge 
            className={`${baseClasses} ${currentStatus === "pending" ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-700 hover:bg-orange-500/20"}`}
          >
            <Clock className="w-3 h-3 mr-1" />
            Pendientes
          </Badge>
        );
      case "assigned":
        return (
          <Badge 
            className={`${baseClasses} ${currentStatus === "assigned" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-500/20"}`}
          >
            <CalendarCheck className="w-3 h-3 mr-1" />
            Asignadas
          </Badge>
        );
      case "inRoute":
        return (
          <Badge 
            className={`${baseClasses} ${currentStatus === "inRoute" ? "bg-rioja-green text-white" : "bg-green-100 text-green-700 hover:bg-rioja-green/20"}`}
          >
            <Ambulance className="w-3 h-3 mr-1" />
            En ruta
          </Badge>
        );
      case "completed":
        return (
          <Badge 
            className={`${baseClasses} ${currentStatus === "completed" ? "bg-green-500 text-white" : "bg-green-100 text-green-700 hover:bg-green-500/20"}`}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Completadas
          </Badge>
        );
      case "cancelled":
        return (
          <Badge 
            className={`${baseClasses} ${currentStatus === "cancelled" ? "bg-red-500 text-white" : "bg-red-100 text-red-700 hover:bg-red-500/20"}`}
          >
            <FileText className="w-3 h-3 mr-1" />
            Canceladas
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onStatusChange("all")}
        className="p-0 h-auto hover:bg-transparent"
      >
        {getStatusBadge("all")}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onStatusChange("pending")}
        className="p-0 h-auto hover:bg-transparent"
      >
        {getStatusBadge("pending")}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onStatusChange("assigned")}
        className="p-0 h-auto hover:bg-transparent"
      >
        {getStatusBadge("assigned")}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onStatusChange("inRoute")}
        className="p-0 h-auto hover:bg-transparent"
      >
        {getStatusBadge("inRoute")}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onStatusChange("completed")}
        className="p-0 h-auto hover:bg-transparent"
      >
        {getStatusBadge("completed")}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onStatusChange("cancelled")}
        className="p-0 h-auto hover:bg-transparent"
      >
        {getStatusBadge("cancelled")}
      </Button>
    </div>
  );
};
