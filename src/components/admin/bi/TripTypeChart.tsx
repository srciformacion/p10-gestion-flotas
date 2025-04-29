
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ChartCard } from "./ChartCard";
import { BiRecord } from "@/types";

interface TripTypeChartProps {
  biData: BiRecord[];
}

export const TripTypeChart = ({ biData }: TripTypeChartProps) => {
  const COLORS = ['#78BE20', '#3D4952', '#BADF94', '#8B979F', '#E8F5D9'];
  
  const tripTypeData = [
    { name: 'Ida', value: biData.filter(d => d.tripType === 'oneWay').length },
    { name: 'Ida y vuelta', value: biData.filter(d => d.tripType === 'roundTrip').length },
  ];

  return (
    <ChartCard
      title="Tipos de traslados"
      description="Distribución entre traslados de ida y ida/vuelta"
    >
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
    </ChartCard>
  );
};
