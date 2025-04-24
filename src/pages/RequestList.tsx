import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RequestStatus } from "@/types";
import { RequireAuth } from "@/components/RequireAuth";
import { SearchBar } from "@/components/requests/SearchBar";
import { StatusFilter } from "@/components/requests/StatusFilter";
import { RequestCard } from "@/components/requests/RequestCard";
import { EmptyState } from "@/components/requests/EmptyState";

const RequestList = () => {
  const { user } = useAuth();
  const { requests } = useRequests();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  
  const queryParams = new URLSearchParams(location.search);
  const statusParam = queryParams.get("status") as RequestStatus | null;
  
  useState(() => {
    if (statusParam && ["pending", "assigned", "inRoute", "completed", "cancelled"].includes(statusParam)) {
      setStatusFilter(statusParam);
    }
  });
  
  const userRequests = user?.role === 'individual' || user?.role === 'hospital'
    ? requests.filter(req => req.createdBy === user.id)
    : requests;
  
  const filteredRequests = userRequests.filter(request => {
    if (statusFilter !== "all" && request.status !== statusFilter) {
      return false;
    }
    
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        request.patientName.toLowerCase().includes(searchTermLower) ||
        request.patientId.toLowerCase().includes(searchTermLower) ||
        request.origin.toLowerCase().includes(searchTermLower) ||
        request.destination.toLowerCase().includes(searchTermLower)
      );
    }
    
    return true;
  });

  const canCreateRequest = user?.role === 'hospital' || user?.role === 'individual';

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
                  <Button>Nueva Solicitud</Button>
                </Link>
              )}
            </div>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <SearchBar value={searchTerm} onChange={setSearchTerm} />
                  <StatusFilter currentStatus={statusFilter} onStatusChange={setStatusFilter} />
                </div>
              </CardContent>
            </Card>
            
            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
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
