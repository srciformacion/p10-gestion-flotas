
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

interface LoginAlertsProps {
  errorMessage: string | null;
  infoMessage: string | null;
}

export const LoginAlerts = ({ errorMessage, infoMessage }: LoginAlertsProps) => {
  return (
    <>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {infoMessage && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>{infoMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
};
