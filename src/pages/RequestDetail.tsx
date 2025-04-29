
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RequireAuth } from "@/components/RequireAuth";
import { Navbar } from "@/components/Navbar";
import { StatusUpdateDialog } from "@/components/requests/detail/StatusUpdateDialog";
import { RequestDetailHeader } from "@/components/requests/detail/RequestDetailHeader";
import { RequestDetailContent } from "@/components/requests/detail/RequestDetailContent";
import { RequestStatusActions } from "@/components/requests/detail/RequestStatusActions";
import { useRequestDetail } from "@/hooks/useRequestDetail";

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { 
    request, 
    vehicleInfo,
    setVehicleInfo,
    isUpdating,
    dialogOpen,
    setDialogOpen,
    newStatus,
    availableStatusChanges,
    formatDateTime,
    handleStatusUpdate,
    updateStatus,
    loadRequest
  } = useRequestDetail(id);
  
  useEffect(() => {
    loadRequest();
  }, [loadRequest]);
  
  if (!id || !request) {
    return null;
  }

  const canUpdateStatus = user?.role === 'ambulance' || user?.role === 'admin';

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
              <RequestDetailHeader 
                id={request.id}
                dateTime={request.dateTime}
                status={request.status}
                formatDateTime={formatDateTime}
              />
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <RequestDetailContent 
                  request={request} 
                  formatDateTime={formatDateTime} 
                />
              </CardContent>
              
              {canUpdateStatus && availableStatusChanges.length > 0 && (
                <CardFooter>
                  <RequestStatusActions
                    availableStatusChanges={availableStatusChanges}
                    onStatusUpdate={handleStatusUpdate}
                  />
                </CardFooter>
              )}
            </Card>
          </div>
        </main>
        
        <StatusUpdateDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          vehicleInfo={vehicleInfo}
          onVehicleInfoChange={setVehicleInfo}
          onConfirm={() => newStatus && updateStatus(newStatus)}
          isUpdating={isUpdating}
          newStatus={newStatus === 'assigned' || newStatus === 'inRoute' ? newStatus : null}
          origin={request.origin}
        />
      </div>
    </RequireAuth>
  );
};

export default RequestDetail;
