
import { Card, CardContent } from "@/components/ui/card";

export const BiEmptyState = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <h3 className="text-xl font-semibold mb-2">No hay datos disponibles</h3>
        <p className="text-muted-foreground text-center">
          Comience a asignar ambulancias a las solicitudes para generar datos de Business Intelligence.
        </p>
      </CardContent>
    </Card>
  );
};
