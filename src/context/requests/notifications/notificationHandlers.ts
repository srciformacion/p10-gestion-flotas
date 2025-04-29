
import { TransportRequest, RequestStatus } from '@/types';

export const createStatusNotification = (
  status: RequestStatus,
  updatedRequest: TransportRequest,
  oldStatus: RequestStatus | undefined
) => {
  const statusMessages = {
    pending: 'Solicitud en espera',
    assigned: 'Vehículo asignado',
    inRoute: 'Vehículo en camino',
    completed: 'Servicio completado',
    cancelled: 'Servicio cancelado'
  };
  
  const notificationTypes = {
    pending: 'info',
    assigned: 'info',
    inRoute: 'info',
    completed: 'success',
    cancelled: 'warning'
  };
  
  if (oldStatus !== status) {
    return {
      title: statusMessages[status],
      message: `Solicitud ${updatedRequest.id} para ${updatedRequest.patientName}: ${statusMessages[status]}`,
      type: notificationTypes[status] as 'info' | 'success' | 'warning' | 'error'
    };
  }
  
  return null;
};

export const createAssignmentNotification = (requestId: string) => {
  return {
    title: 'Asignación automática',
    message: `Se ha asignado automáticamente un vehículo a la solicitud ${requestId}`,
    type: 'success' as const
  };
};

export const createAssignmentErrorNotification = (requestId: string) => {
  return {
    title: 'Error en asignación',
    message: `No se pudo asignar un vehículo automáticamente a la solicitud ${requestId}`,
    type: 'error' as const
  };
};

export const createRequestNotification = (patientName: string) => {
  return {
    title: 'Nueva solicitud',
    message: `Se ha creado una nueva solicitud para ${patientName}`,
    type: 'info' as const
  };
};
