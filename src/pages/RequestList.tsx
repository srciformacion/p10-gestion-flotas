import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RequestStatus } from "@/types";
import { RequireAuth } from "@/components/RequireAuth";
import { SearchBar } from "@/components/requests/SearchBar";
import { StatusFilter } from "@/components/requests/StatusFilter";
import { RequestCard } from "@/components/requests/RequestCard";
import { EmptyState } from "@/components/requests/EmptyState";
import { Plus, Database } from "lucide-react";

const RequestList = () => {
  const { user } = useAuth();
  const { requests, useMockData, setUseMockData } = useRequests();
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
  
  const userRequests = user?.role === 'individual' || user?.role === 'hospital' || user?.role === 'admin'
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

  const canCreateRequest = user?.role === 'hospital' || user?.role === 'individual' || user?.role === 'admin';

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Solicitudes de Transporte
                </h1>
                <p className="text-muted-foreground">
                  Total de solicitudes: {requests.length}
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Mock Data Toggle */}
                <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
                  <Database className="h-4 w-4" />
                  <Label htmlFor="mock-data" className="text-sm">
                    Datos simulados (300 servicios)
                  </Label>
                  <Switch
                    id="mock-data"
                    checked={useMockData}
                    onCheckedChange={setUseMockData}
                  />
                </div>
                
                {canCreateRequest && (
                  <Link to="/nueva-solicitud">
                    <Button className="w-full md:w-auto" size="lg">
                      <Plus className="mr-2" />
                      Nueva Solicitud
                    </Button>
                  </Link>
                )}
              </div>
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
