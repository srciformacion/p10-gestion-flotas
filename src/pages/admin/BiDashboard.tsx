
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BiRecord } from "@/types";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { DataTable } from "@/components/admin/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

const BiDashboard = () => {
  const [biData, setBiData] = useState<BiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real application, this would call an API endpoint
        const storedData = localStorage.getItem('bi_records');
        const data = storedData ? JSON.parse(storedData) : [];
        setBiData(data);
      } catch (error) {
        console.error("Error fetching BI data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Sample data for charts
  const serviceTypeData = [
    { name: 'Consulta', value: biData.filter(d => d.serviceType === 'consultation').length },
    { name: 'Ingreso', value: biData.filter(d => d.serviceType === 'admission').length },
    { name: 'Alta', value: biData.filter(d => d.serviceType === 'discharge').length },
    { name: 'Traslado', value: biData.filter(d => d.serviceType === 'transfer').length },
  ];
  
  const transportTypeData = [
    { name: 'Camilla', value: biData.filter(d => d.transportType === 'stretcher').length },
    { name: 'Silla', value: biData.filter(d => d.transportType === 'wheelchair').length },
    { name: 'Andando', value: biData.filter(d => d.transportType === 'walking').length },
  ];
  
  const tripTypeData = [
    { name: 'Ida', value: biData.filter(d => d.tripType === 'oneWay').length },
    { name: 'Ida y vuelta', value: biData.filter(d => d.tripType === 'roundTrip').length },
  ];
  
  const zoneData = Object.entries(
    biData.reduce((acc, curr) => {
      const zone = curr.zone || 'Desconocido';
      acc[zone] = (acc[zone] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));
  
  // For DataTable
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

  const COLORS = ['#78BE20', '#3D4952', '#BADF94', '#8B979F', '#E8F5D9'];

  return (
    <RequireAuth allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Business Intelligence</h1>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
              </div>
            ) : biData.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <h3 className="text-xl font-semibold mb-2">No hay datos disponibles</h3>
                  <p className="text-muted-foreground text-center">
                    Comience a asignar ambulancias a las solicitudes para generar datos de Business Intelligence.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="dashboard">
                <TabsList className="mb-6">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="rawData">Datos detallados</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Service Type Distribution */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Distribución por tipo de servicio</CardTitle>
                        <CardDescription>
                          Porcentaje de servicios por tipo (consulta, ingreso, alta, traslado)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={serviceTypeData}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {serviceTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    
                    {/* Transport Type Distribution */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Distribución por medio de transporte</CardTitle>
                        <CardDescription>
                          Porcentaje de servicios por tipo de medio (camilla, silla, andando)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={transportTypeData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey="value" 
                              name="Cantidad" 
                              fill="#78BE20"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    
                    {/* Zone Distribution */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Servicios por zona</CardTitle>
                        <CardDescription>
                          Distribución geográfica de los servicios
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={zoneData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey="value" 
                              name="Servicios" 
                              fill="#3D4952"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    
                    {/* Trip Type Distribution */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Tipos de traslados</CardTitle>
                        <CardDescription>
                          Distribución entre traslados de ida y ida/vuelta
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={tripTypeData}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {tripTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="rawData">
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
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default BiDashboard;
