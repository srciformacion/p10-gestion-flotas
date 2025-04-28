
import { useState, useEffect } from "react";
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

const RequestList = () => {
  const { user } = useAuth();
  const { requests } = useRequests();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  
  // Get status from URL parameters if provided
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
  
  // Filter requests based on user role
  const userRequests = user?.role === 'individual' || user?.role === 'hospital' 
    ? requests.filter(req => req.createdBy === user.id)
    : user?.role === 'admin'
    ? requests // Admin sees all requests
    : requests; // Default (ambulance companies see all)
  
  // Apply search and status filters
  const filteredRequests = userRequests.filter(request => {
    // Filter by status
    if (statusFilter !== "all" && request.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        request.patientName.toLowerCase().includes(searchTermLower) ||
        (request.patientId && request.patientId.toLowerCase().includes(searchTermLower)) ||
        request.origin.toLowerCase().includes(searchTermLower) ||
        request.destination.toLowerCase().includes(searchTermLower)
      );
    }
    
    return true;
  });

  // Sort by date (newest first)
  const sortedRequests = [...filteredRequests].sort((a, b) => 
    new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusChange = (status: RequestStatus | "all") => {
    setStatusFilter(status);
  };

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
              {sortedRequests.length} {sortedRequests.length === 1 ? 'resultado' : 'resultados'} encontrados
            </div>
            
            {sortedRequests.length > 0 ? (
              <div className="space-y-4">
                {sortedRequests.map((request) => (
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
