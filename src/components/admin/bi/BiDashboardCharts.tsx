
import { BiRecord } from "@/types";
import { ServiceTypeChart } from "./ServiceTypeChart";
import { TransportTypeChart } from "./TransportTypeChart";
import { ZoneChart } from "./ZoneChart";
import { TripTypeChart } from "./TripTypeChart";

interface BiDashboardChartsProps {
  biData: BiRecord[];
}

export const BiDashboardCharts = ({ biData }: BiDashboardChartsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ServiceTypeChart biData={biData} />
      <TransportTypeChart biData={biData} />
      <ZoneChart biData={biData} />
      <TripTypeChart biData={biData} />
    </div>
  );
};
