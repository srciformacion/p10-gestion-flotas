
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartCard } from "./ChartCard";
import { BiRecord } from "@/types";

interface ZoneChartProps {
  biData: BiRecord[];
}

export const ZoneChart = ({ biData }: ZoneChartProps) => {
  const zoneData = Object.entries(
    biData.reduce((acc, curr) => {
      const zone = curr.zone || 'Desconocido';
      acc[zone] = (acc[zone] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  return (
    <ChartCard
      title="Servicios por zona"
      description="Distribución geográfica de los servicios"
    >
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
    </ChartCard>
  );
};
