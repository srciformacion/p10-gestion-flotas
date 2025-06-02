
import { UserRole, UserPermissions } from '@/types/user';

export const getRolePermissions = (role: UserRole): UserPermissions => {
  const permissions: Record<UserRole, UserPermissions> = {
    admin: {
      canManageUsers: true,
      canManageAmbulances: true,
      canCreateRequests: true,
      canManageRequests: true,
      canViewTracking: true,
      canManageRoutes: true,
      canAccessDispatch: true,
      canViewAnalytics: true,
    },
    centroCoordinador: {
      canManageUsers: false,
      canManageAmbulances: true,
      canCreateRequests: true,
      canManageRequests: true,
      canViewTracking: true,
      canManageRoutes: true,
      canAccessDispatch: true,
      canViewAnalytics: true,
    },
    hospital: {
      canManageUsers: false,
      canManageAmbulances: false,
      canCreateRequests: true,
      canManageRequests: false,
      canViewTracking: false,
      canManageRoutes: false,
      canAccessDispatch: false,
      canViewAnalytics: false,
    },
    individual: {
      canManageUsers: false,
      canManageAmbulances: false,
      canCreateRequests: true,
      canManageRequests: false,
      canViewTracking: false,
      canManageRoutes: false,
      canAccessDispatch: false,
      canViewAnalytics: false,
    },
    equipoMovil: {
      canManageUsers: false,
      canManageAmbulances: false,
      canCreateRequests: false,
      canManageRequests: false,
      canViewTracking: false,
      canManageRoutes: false,
      canAccessDispatch: false,
      canViewAnalytics: false,
    },
    ambulance: {
      canManageUsers: false,
      canManageAmbulances: false,
      canCreateRequests: false,
      canManageRequests: false,
      canViewTracking: false,
      canManageRoutes: false,
      canAccessDispatch: false,
      canViewAnalytics: false,
    },
  };

  return permissions[role];
};

export const hasPermission = (role: UserRole, permission: keyof UserPermissions): boolean => {
  const permissions = getRolePermissions(role);
  return permissions[permission];
};
