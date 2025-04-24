
import { Button } from "@/components/ui/button";
import { RequestStatus } from "@/types";
import { Ambulance, CalendarCheck, Clock, FileText } from "lucide-react";

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
        className="flex items-center gap-1"
      >
        <Clock className="h-3 w-3" /> Pendientes
      </Button>
      <Button
        variant={currentStatus === "assigned" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("assigned")}
        className="flex items-center gap-1"
      >
        <CalendarCheck className="h-3 w-3" /> Asignadas
      </Button>
      <Button
        variant={currentStatus === "inRoute" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("inRoute")}
        className="flex items-center gap-1"
      >
        <Ambulance className="h-3 w-3" /> En ruta
      </Button>
      <Button
        variant={currentStatus === "completed" ? "default" : "outline"}
        size="sm"
        onClick={() => onStatusChange("completed")}
        className="flex items-center gap-1"
      >
        <FileText className="h-3 w-3" /> Completadas
      </Button>
    </div>
  );
};
