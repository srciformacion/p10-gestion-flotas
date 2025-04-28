
import { Assignment, AssignmentIncident, BiRecord } from '@/types';
import { requestsApi } from './requests';

export const assignmentsApi = {
  getAll: async (): Promise<Assignment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('assignments');
    return stored ? JSON.parse(stored) : [];
  },

  getById: async (id: string): Promise<Assignment | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = localStorage.getItem('assignments');
    const assignments: Assignment[] = stored ? JSON.parse(stored) : [];
    return assignments.find(assignment => assignment.id === id) || null;
  },

  create: async (assignment: Omit<Assignment, 'id'>): Promise<Assignment> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const newAssignment: Assignment = {
      ...assignment,
      id: crypto.randomUUID(),
    };
    
    const stored = localStorage.getItem('assignments');
    const assignments: Assignment[] = stored ? JSON.parse(stored) : [];
    assignments.push(newAssignment);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    return newAssignment;
  },

  update: async (id: string, data: Partial<Assignment>): Promise<Assignment> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('assignments');
    const assignments: Assignment[] = stored ? JSON.parse(stored) : [];
    const index = assignments.findIndex(assignment => assignment.id === id);
    
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    
    const updatedAssignment = {
      ...assignments[index],
      ...data
    };
    
    assignments[index] = updatedAssignment;
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    return updatedAssignment;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const stored = localStorage.getItem('assignments');
    const assignments: Assignment[] = stored ? JSON.parse(stored) : [];
    const filtered = assignments.filter(assignment => assignment.id !== id);
    localStorage.setItem('assignments', JSON.stringify(filtered));
  },

  getByRequestId: async (requestId: string): Promise<Assignment | null> => {
    const allAssignments = await assignmentsApi.getAll();
    return allAssignments.find(assignment => assignment.requestId === requestId) || null;
  },

  getByAmbulanceId: async (ambulanceId: string): Promise<Assignment[]> => {
    const allAssignments = await assignmentsApi.getAll();
    return allAssignments.filter(assignment => assignment.ambulanceId === ambulanceId);
  },

  addIncident: async (assignmentId: string, incident: Omit<AssignmentIncident, 'id' | 'assignmentId'>): Promise<AssignmentIncident> => {
    const assignment = await assignmentsApi.getById(assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const newIncident: AssignmentIncident = {
      id: crypto.randomUUID(),
      assignmentId,
      ...incident
    };

    const incidents = assignment.incidents || [];
    incidents.push(newIncident);

    await assignmentsApi.update(assignmentId, { incidents });
    return newIncident;
  },

  recordBiData: async (data: Omit<BiRecord, 'id'>): Promise<BiRecord> => {
    const newRecord: BiRecord = {
      ...data,
      id: crypto.randomUUID(),
    };

    const stored = localStorage.getItem('bi_records');
    const records: BiRecord[] = stored ? JSON.parse(stored) : [];
    records.push(newRecord);
    localStorage.setItem('bi_records', JSON.stringify(records));

    return newRecord;
  },
};
