
export interface KPI {
  label: string;
  value: number | string;
  previousValue?: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  format?: 'number' | 'percentage' | 'time' | 'currency';
}

export interface AnalyticsData {
  totalRequests: KPI;
  completedRequests: KPI;
  averageResponseTime: KPI;
  ambulanceUtilization: KPI;
  customerSatisfaction: KPI;
  fuelEfficiency: KPI;
  maintenanceCosts: KPI;
  revenue: KPI;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}
