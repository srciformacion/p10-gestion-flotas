
export interface SystemConfig {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  timezone: string;
  language: string;
  currency: string;
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
  emergencyProtocol: {
    maxResponseTime: number;
    escalationLevels: string[];
    notificationChannels: string[];
  };
  routeOptimization: {
    enabled: boolean;
    algorithm: string;
    maxDistance: number;
    maxDuration: number;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface NotificationSettings {
  requestUpdates: boolean;
  ambulanceStatus: boolean;
  routeChanges: boolean;
  emergencyAlerts: boolean;
  systemMaintenance: boolean;
  weeklyReports: boolean;
}
