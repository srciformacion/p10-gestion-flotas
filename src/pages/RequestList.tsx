
import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RequestStatus } from "@/types";
import { RequireAuth } from "@/components/RequireAuth";
import { SearchBar } from "@/components/requests/SearchBar";
import { StatusFilter } from "@/components/requests/StatusFilter";
import { RequestCard } from "@/components/requests/RequestCard";
import { EmptyState } from "@/components/requests/EmptyState";
import { Plus } from "lucide-react";

// Debounce function to optimize search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const RequestList = () => {
  const { user } = useAuth();
  const { requests, fetchRequests, isLoading, totalRequests } = useRequests();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  
  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Get status from URL parameters if provided and update filters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const statusParam = queryParams.get("status") as RequestStatus | null;
    
    if (statusParam && ["pending", "assigned", "inRoute", "completed", "cancelled"].includes(statusParam)) {
      setStatusFilter(statusParam);
    }
  }, [location.search]);
  
  // Update URL when filter changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    if (statusFilter !== "all") {
      queryParams.set("status", statusFilter);
    } else {
      queryParams.delete("status");
    }
    
    const search = queryParams.toString();
    const newUrl = search ? `${location.pathname}?${search}` : location.pathname;
    
    navigate(newUrl, { replace: true });
  }, [statusFilter, location.pathname, navigate]);
  
  // Fetch requests whenever filters change
  useEffect(() => {
    fetchRequests({
      status: statusFilter,
      search: debouncedSearchTerm
    });
  }, [fetchRequests, statusFilter, debouncedSearchTerm]);
  
  // Memoized handler functions to prevent unnecessary re-renders
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleStatusChange = useCallback((status: RequestStatus | "all") => {
    setStatusFilter(status);
  }, []);

  // Check user permissions
  const canCreateRequest = user?.role === 'hospital' || user?.role === 'individual' || user?.role === 'admin';

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
                Solicitudes de Transporte
              </h1>
              
              {canCreateRequest && (
                <Link to="/nueva-solicitud">
                  <Button className="w-full md:w-auto" size="lg">
                    <Plus className="mr-2" />
                    Nueva Solicitud
                  </Button>
                </Link>
              )}
            </div>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <SearchBar value={searchTerm} onChange={handleSearchChange} />
                  <StatusFilter currentStatus={statusFilter} onStatusChange={handleStatusChange} />
                </div>
              </CardContent>
            </Card>
            
            <div className="mb-4 text-sm text-muted-foreground">
              {isLoading ? 'Cargando...' : (
                <>
                  {requests.length} {requests.length === 1 ? 'resultado' : 'resultados'} encontrados
                </>
              )}
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </Card>
                ))}
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <EmptyState 
                statusFilter={statusFilter}
                searchTerm={searchTerm}
                onResetFilter={() => setStatusFilter("all")}
                showNewRequestButton={canCreateRequest}
              />
            )}
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default RequestList;
