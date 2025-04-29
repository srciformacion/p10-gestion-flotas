
import { Button } from "@/components/ui/button";
import { RequestStatus } from "@/types";

interface RequestStatusActionsProps {
  availableStatusChanges: RequestStatus[];
  onStatusUpdate: (status: RequestStatus) => void;
}

export const RequestStatusActions = ({ 
  availableStatusChanges, 
  onStatusUpdate 
}: RequestStatusActionsProps) => {
  
  if (availableStatusChanges.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-end space-x-2">
      {availableStatusChanges.includes('assigned') && (
        <Button onClick={() => onStatusUpdate('assigned')}>
          Asignar Vehículo
        </Button>
      )}
      
      {availableStatusChanges.includes('inRoute') && (
        <Button onClick={() => onStatusUpdate('inRoute')}>
          En Camino
        </Button>
      )}
      
      {availableStatusChanges.includes('completed') && (
        <Button onClick={() => onStatusUpdate('completed')}>
          Completar
        </Button>
      )}
      
      {availableStatusChanges.includes('cancelled') && (
        <Button variant="destructive" onClick={() => onStatusUpdate('cancelled')}>
          Cancelar
        </Button>
      )}
      
      {availableStatusChanges.includes('pending') && (
        <Button variant="outline" onClick={() => onStatusUpdate('pending')}>
          Reactivar
        </Button>
      )}
    </div>
  );
};
