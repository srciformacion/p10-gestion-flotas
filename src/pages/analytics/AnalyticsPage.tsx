
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnalyticsPage = () => {
  const kpis = [
    {
      title: "Solicitudes Totales",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Users
    },
    {
      title: "Tiempo Promedio Respuesta",
      value: "12 min",
      change: "-8%",
      trend: "down",
      icon: Clock
    },
    {
      title: "Tasa de Satisfacción",
      value: "94%",
      change: "+3%",
      trend: "up",
      icon: TrendingUp
    },
    {
      title: "Eficiencia Operativa",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: BarChart3
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analíticas y Reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs ${
                kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Gráfico en desarrollo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Tipo de Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Gráfico en desarrollo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
