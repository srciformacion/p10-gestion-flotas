
import { PatientInfo } from "./PatientInfo";
import { TransportInfo } from "./TransportInfo";
import { DateAndTypeInfo } from "./DateAndTypeInfo";
import { ResponsibleInfo } from "./ResponsibleInfo";
import { VehicleInfo } from "./VehicleInfo";
import { RealTimeTracking } from "./RealTimeTracking";
import { TransportRequest } from "@/types";

interface RequestDetailContentProps {
  request: TransportRequest;
  formatDateTime: (dateTimeStr: string) => string;
}

export const RequestDetailContent = ({ request, formatDateTime }: RequestDetailContentProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
        <PatientInfo name={request.patientName} id={request.patientId} />
        <TransportInfo origin={request.origin} destination={request.destination} />
        <DateAndTypeInfo 
          dateTime={request.dateTime}
          transportType={request.transportType}
          formatDateTime={formatDateTime}
        />
        <ResponsibleInfo 
          responsiblePerson={request.responsiblePerson}
          authorizationFile={request.authorizationFile}
        />
      </div>
      
      {request.observations && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">Observaciones</h3>
          <p>{request.observations}</p>
        </div>
      )}
      
      {(request.status === 'assigned' || request.status === 'inRoute') && (
        <VehicleInfo 
          vehicle={request.assignedVehicle || ''}
          estimatedArrival={request.estimatedArrival}
          formatDateTime={formatDateTime}
        />
      )}
      
      {(request.status === 'assigned' || request.status === 'inRoute') && 
        request.assignedVehicle && (
        <RealTimeTracking 
          requestId={request.id}
          vehicleId={request.assignedVehicle}
        />
      )}
    </div>
  );
};
