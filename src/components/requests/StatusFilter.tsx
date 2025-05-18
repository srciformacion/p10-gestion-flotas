
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RequestStatus } from "@/types";
import { Ambulance, CheckCircle, Clock, AlertTriangle, Calendar } from "lucide-react";

interface StatusFilterProps {
  currentStatus: RequestStatus | "all";
  onStatusChange: (status: RequestStatus | "all") => void;
}

export const StatusFilter = React.memo(({ currentStatus, onStatusChange }: StatusFilterProps) => {
  const handleStatusChange = useCallback((status: RequestStatus | "all") => {
    onStatusChange(status);
  }, [onStatusChange]);

  const getButtonClass = (status: RequestStatus) => {
    let activeClass = "";
    let hoverClass = "";

    switch (status) {
      case "pending": // Amarillo
        activeClass = "bg-status-pending text-neutral-800 border-status-pending hover:bg-status-pending/90 hover:text-neutral-800";
        hoverClass = "hover:border-status-pending hover:text-status-pending";
        break;
      case "assigned": // Verde primario
        activeClass = "bg-status-assigned text-white border-status-assigned hover:bg-status-assigned/90";
        hoverClass = "hover:border-status-assigned hover:text-status-assigned";
        break;
      case "inRoute": // Verde primario
        activeClass = "bg-status-inRoute text-white border-status-inRoute hover:bg-status-inRoute/90";
        hoverClass = "hover:border-status-inRoute hover:text-status-inRoute";
        break;
      case "completed": // Verde oscuro
        activeClass = "bg-status-completed text-white border-status-completed hover:bg-status-completed/90";
        hoverClass = "hover:border-status-completed hover:text-status-completed";
        break;
      case "cancelled": // Rojo
        activeClass = "bg-status-cancelled text-white border-status-cancelled hover:bg-status-cancelled/90";
        hoverClass = "hover:border-status-cancelled hover:text-status-cancelled";
        break;
      default:
        break;
    }
    return currentStatus === status ? activeClass : hoverClass;
  };


  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
      <Button
        variant={currentStatus === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => handleStatusChange("all")}
      >
        Todas
      </Button>
      <Button
        variant={currentStatus === "pending" ? "default" : "outline"}
        size="sm"
        onClick={() => handleStatusChange("pending")}
        className={`flex items-center gap-1 ${getButtonClass("pending")}`}
      >
        <Clock className="h-3 w-3" /> Pendientes
      </Button>
      <Button
        variant={currentStatus === "assigned" ? "default" : "outline"}
        size="sm"
        onClick={() => handleStatusChange("assigned")}
        className={`flex items-center gap-1 ${getButtonClass("assigned")}`}
      >
        <Calendar className="h-3 w-3" /> Asignadas
      </Button>
      <Button
        variant={currentStatus === "inRoute" ? "default" : "outline"}
        size="sm"
        onClick={() => handleStatusChange("inRoute")}
        className={`flex items-center gap-1 ${getButtonClass("inRoute")}`}
      >
        <Ambulance className="h-3 w-3" /> En ruta
      </Button>
      <Button
        variant={currentStatus === "completed" ? "default" : "outline"}
        size="sm"
        onClick={() => handleStatusChange("completed")}
        className={`flex items-center gap-1 ${getButtonClass("completed")}`}
      >
        <CheckCircle className="h-3 w-3" /> Completadas
      </Button>
      <Button
        variant={currentStatus === "cancelled" ? "default" : "outline"}
        size="sm"
        onClick={() => handleStatusChange("cancelled")}
        className={`flex items-center gap-1 ${getButtonClass("cancelled")}`}
      >
        <AlertTriangle className="h-3 w-3" /> Canceladas
      </Button>
    </div>
  );
});

StatusFilter.displayName = "StatusFilter";
