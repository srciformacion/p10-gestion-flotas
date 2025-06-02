
export type UserRole = 
  | 'admin' 
  | 'hospital' 
  | 'individual' 
  | 'ambulance'
  | 'centroCoordinador'
  | 'equipoMovil';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
  phone?: string;
  organization?: string;
}

export interface UserPermissions {
  canManageUsers: boolean;
  canManageAmbulances: boolean;
  canCreateRequests: boolean;
  canManageRequests: boolean;
  canViewTracking: boolean;
  canManageRoutes: boolean;
  canAccessDispatch: boolean;
  canViewAnalytics: boolean;
}
