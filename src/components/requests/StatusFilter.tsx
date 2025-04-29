
import { Button } from "@/components/ui/button";
import { RequestStatus } from "@/types";
import { Ambulance, CheckCircle, Clock, AlertTriangle, Calendar } from "lucide-react";

interface StatusFilterProps {
  currentStatus: RequestStatus | "all";
  onStatusChange: (status: RequestStatus | "all") => void;
}

export const StatusFilter = ({ currentStatus, onStatusChange }: StatusFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
      <Button
        variant={currentStatus === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("all")}
      >
        Todas
      </Button>
      <Button
        variant={currentStatus === "pending" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("pending")}
        className={`flex items-center gap-1 ${currentStatus === "pending" ? "bg-status-pending text-white border-status-pending" : "hover:border-status-pending hover:text-status-pending"}`}
      >
        <Clock className="h-3 w-3" /> Pendientes
      </Button>
      <Button
        variant={currentStatus === "assigned" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("assigned")}
        className={`flex items-center gap-1 ${currentStatus === "assigned" ? "bg-status-assigned text-white border-status-assigned" : "hover:border-status-assigned hover:text-status-assigned"}`}
      >
        <Calendar className="h-3 w-3" /> Asignadas
      </Button>
      <Button
        variant={currentStatus === "inRoute" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("inRoute")}
        className={`flex items-center gap-1 ${currentStatus === "inRoute" ? "bg-status-inRoute text-white border-status-inRoute" : "hover:border-status-inRoute hover:text-status-inRoute"}`}
      >
        <Ambulance className="h-3 w-3" /> En ruta
      </Button>
      <Button
        variant={currentStatus === "completed" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("completed")}
        className={`flex items-center gap-1 ${currentStatus === "completed" ? "bg-status-completed text-white border-status-completed" : "hover:border-status-completed hover:text-status-completed"}`}
      >
        <CheckCircle className="h-3 w-3" /> Completadas
      </Button>
      <Button
        variant={currentStatus === "cancelled" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("cancelled")}
        className={`flex items-center gap-1 ${currentStatus === "cancelled" ? "bg-status-cancelled text-white border-status-cancelled" : "hover:border-status-cancelled hover:text-status-cancelled"}`}
      >
        <AlertTriangle className="h-3 w-3" /> Canceladas
      </Button>
    </div>
  );
};
