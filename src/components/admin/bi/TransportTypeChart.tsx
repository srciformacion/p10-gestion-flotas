
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartCard } from "./ChartCard";
import { BiRecord } from "@/types";

interface TransportTypeChartProps {
  biData: BiRecord[];
}

export const TransportTypeChart = ({ biData }: TransportTypeChartProps) => {
  const transportTypeData = [
    { name: 'Camilla', value: biData.filter(d => d.transportType === 'stretcher').length },
    { name: 'Silla', value: biData.filter(d => d.transportType === 'wheelchair').length },
    { name: 'Andando', value: biData.filter(d => d.transportType === 'walking').length },
  ];

  return (
    <ChartCard
      title="Distribución por medio de transporte"
      description="Porcentaje de servicios por tipo de medio (camilla, silla, andando)"
    >
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
    </ChartCard>
  );
};
