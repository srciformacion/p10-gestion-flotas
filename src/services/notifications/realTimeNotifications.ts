
import { TransportRequest } from "@/types";

type NotificationCallback = (notification: {
  type: 'status_change' | 'new_request' | 'assignment';
  requestId: string;
  status?: TransportRequest['status'];
  data?: any;
}) => void;

// This would eventually be replaced with a real WebSocket connection
class RealTimeNotificationService {
  private listeners: NotificationCallback[] = [];
  private intervalId: number | null = null;
  private pendingNotifications: any[] = [];

  constructor() {
    // Setup periodic checking (simulating real-time)
    this.startPolling();
  }

  subscribe(callback: NotificationCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notify(notification: any) {
    this.listeners.forEach(listener => listener(notification));
  }

  // Simulate receiving notifications
  private startPolling() {
    this.intervalId = setInterval(() => {
      // Check for new notifications from the server
      if (this.pendingNotifications.length > 0) {
        const notification = this.pendingNotifications.shift();
        this.notify(notification);
      }
    }, 5000) as unknown as number;
  }

  stopPolling() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // In a real app, this would be called from the server via WebSocket
  // For now, we'll simulate by queuing notifications
  simulateNotification(notification: any) {
    this.pendingNotifications.push(notification);
  }

  // Clean up
  cleanup() {
    this.stopPolling();
    this.listeners = [];
  }
}

export const realTimeNotificationService = new RealTimeNotificationService();
