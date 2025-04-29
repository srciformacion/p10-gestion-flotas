
import { BiRecord } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/admin/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface BiDataTableProps {
  biData: BiRecord[];
}

export const BiDataTable = ({ biData }: BiDataTableProps) => {
  const columns: ColumnDef<BiRecord>[] = [
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
      },
    },
    {
      accessorKey: "zone",
      header: "Zona",
    },
    {
      accessorKey: "serviceType",
      header: "Tipo servicio",
      cell: ({ row }) => {
        const serviceType = row.getValue("serviceType") as string;
        const labels: Record<string, string> = {
          consultation: "Consulta",
          admission: "Ingreso",
          discharge: "Alta",
          transfer: "Traslado",
        };
        return labels[serviceType] || serviceType;
      },
    },
    {
      accessorKey: "tripType",
      header: "Tipo traslado",
      cell: ({ row }) => {
        const tripType = row.getValue("tripType") as string;
        return tripType === "oneWay" ? "Ida" : "Ida y vuelta";
      },
    },
    {
      accessorKey: "transportType",
      header: "Medio",
      cell: ({ row }) => {
        const transportType = row.getValue("transportType") as string;
        const labels: Record<string, string> = {
          stretcher: "Camilla",
          wheelchair: "Silla",
          walking: "Andando",
        };
        return labels[transportType] || transportType;
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const labels: Record<string, string> = {
          pending: "Pendiente",
          assigned: "Asignado",
          inRoute: "En ruta",
          completed: "Completado",
          cancelled: "Cancelado",
        };
        
        const variants: Record<string, string> = {
          pending: "warning",
          assigned: "default",
          inRoute: "default",
          completed: "success",
          cancelled: "destructive",
        };
        
        return (
          <Badge variant={variants[status] as any}>
            {labels[status] || status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Duración",
      cell: ({ row }) => {
        const duration = row.getValue("duration");
        return duration ? `${duration} min` : "N/A";
      },
    },
    {
      accessorKey: "occupancyRate",
      header: "Ocupación",
      cell: ({ row }) => {
        const rate = row.getValue("occupancyRate");
        return rate ? `${rate}%` : "N/A";
      },
    },
    {
      accessorKey: "hadIncidents",
      header: "Incidencias",
      cell: ({ row }) => {
        const hadIncidents = row.getValue("hadIncidents");
        return hadIncidents ? "Sí" : "No";
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos completos</CardTitle>
        <CardDescription>
          Explorar todos los datos registrados en el sistema para análisis detallado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={biData} />
      </CardContent>
    </Card>
  );
};
