
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'urgent';
export type NotificationCategory = 'request_status' | 'system' | 'chat' | 'maintenance';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
  userId: string;
  actionUrl?: string;
  actionLabel?: string;
  requestId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: 'response' | 'status_update' | 'emergency' | 'routine';
  roles: string[];
  variables?: string[];
}

export interface NotificationPreference {
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  categories: {
    request_status: boolean;
    system: boolean;
    chat: boolean;
    maintenance: boolean;
  };
  urgentOnly: boolean;
}
