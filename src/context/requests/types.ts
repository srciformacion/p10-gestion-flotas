
import { TransportRequest, Assignment, RequestStatus } from '@/types';

export interface RequestsContextType {
  requests: TransportRequest[];
  filteredRequests: TransportRequest[];
  assignments: Assignment[];
  addRequest: (request: Omit<TransportRequest, 'id' | 'status'>) => Promise<void>;
  updateRequestStatus: (id: string, status: RequestStatus, data?: Partial<TransportRequest>) => Promise<void>;
  getRequestById: (id: string) => TransportRequest | undefined;
  assignVehicleAutomatically: (requestId: string) => Promise<Assignment | null>;
  checkForAssignmentConflicts: (requestId: string, ambulanceId: string, dateTime: string) => Promise<boolean>;
  getAssignmentForRequest: (requestId: string) => Promise<Assignment | null>;
  isLoading: boolean;
  fetchRequests: (filters?: { status?: RequestStatus | 'all', search?: string }) => Promise<void>;
  pageSize: number;
  currentPage: number;
  totalRequests: number;
  setCurrentPage: (page: number) => void;
  clearCache: () => void;
}
