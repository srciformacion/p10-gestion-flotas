
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { RequestStatus } from "@/types";

interface EmptyStateProps {
  statusFilter: RequestStatus | "all";
  searchTerm: string;
  onResetFilter: () => void;
  showNewRequestButton: boolean;
}

export const EmptyState = ({ 
  statusFilter, 
  searchTerm, 
  onResetFilter,
  showNewRequestButton 
}: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No hay solicitudes</h3>
        {statusFilter !== "all" ? (
          <p className="text-muted-foreground text-center max-w-md">
            No se encontraron solicitudes con el estado seleccionado. Intenta cambiar el filtro o realizar una nueva búsqueda.
          </p>
        ) : searchTerm ? (
          <p className="text-muted-foreground text-center max-w-md">
            No se encontraron solicitudes que coincidan con tu búsqueda. Intenta con otros términos.
          </p>
        ) : (
          <p className="text-muted-foreground text-center max-w-md">
            No hay solicitudes de transporte registradas en el sistema.
            {showNewRequestButton && (
              <> Puedes crear una nueva solicitud haciendo clic en el botón "Nueva Solicitud".</>
            )}
          </p>
        )}
        
        {showNewRequestButton && (
          <Link to="/nueva-solicitud" className="mt-4">
            <Button>Nueva Solicitud</Button>
          </Link>
        )}
        
        {statusFilter !== "all" && (
          <Button 
            variant="link" 
            onClick={onResetFilter}
            className="mt-2"
          >
            Ver todas las solicitudes
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
