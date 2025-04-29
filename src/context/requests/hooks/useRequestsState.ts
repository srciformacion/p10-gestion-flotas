
import { useState, useCallback } from 'react';
import { TransportRequest, RequestStatus } from '@/types';
import { Assignment } from '@/types';

export const useRequestsState = () => {
  // State management
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRequests, setTotalRequests] = useState(0);
  const [requestCache, setRequestCache] = useState<Record<string, TransportRequest>>({});

  return {
    requests,
    setRequests,
    assignments,
    setAssignments,
    isLoading,
    setIsLoading,
    currentPage,
    setCurrentPage,
    pageSize,
    totalRequests, 
    setTotalRequests,
    requestCache,
    setRequestCache
  };
};
