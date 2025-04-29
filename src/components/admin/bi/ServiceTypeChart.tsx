
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ChartCard } from "./ChartCard";
import { BiRecord } from "@/types";

interface ServiceTypeChartProps {
  biData: BiRecord[];
}

export const ServiceTypeChart = ({ biData }: ServiceTypeChartProps) => {
  const COLORS = ['#78BE20', '#3D4952', '#BADF94', '#8B979F', '#E8F5D9'];
  
  const serviceTypeData = [
    { name: 'Consulta', value: biData.filter(d => d.serviceType === 'consultation').length },
    { name: 'Ingreso', value: biData.filter(d => d.serviceType === 'admission').length },
    { name: 'Alta', value: biData.filter(d => d.serviceType === 'discharge').length },
    { name: 'Traslado', value: biData.filter(d => d.serviceType === 'transfer').length },
  ];

  return (
    <ChartCard
      title="Distribución por tipo de servicio"
      description="Porcentaje de servicios por tipo (consulta, ingreso, alta, traslado)"
    >
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
    </ChartCard>
  );
};
