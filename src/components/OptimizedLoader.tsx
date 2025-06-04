
import { Loader2 } from "lucide-react";

export const OptimizedLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">AmbulLink</h2>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    </div>
  );
};
