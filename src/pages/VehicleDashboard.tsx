
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { RequireAuth } from '@/components/RequireAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const VehicleDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is not an ambulance or if vehicle_id is missing
    if (!user || user.role !== 'ambulance') {
      navigate('/dashboard'); // Or to an appropriate page like /login or /access-denied
    }
    // We might add a check for user.vehicle_id here later if it's strictly required for this dashboard
  }, [user, navigate]);

  if (!user || user.role !== 'ambulance') {
    return null; // Or a loading indicator
  }

  return (
    <RequireAuth allowedRoles={['ambulance']}>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Panel del Vehículo ({user.vehicle_id || 'ID no asignado'})</CardTitle>
              <CardDescription>Bienvenido, {user.name}. Aquí podrás gestionar los servicios asignados a tu vehículo.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Próximamente: Lista de servicios, detalles y acciones.</p>
              {/* Placeholder for future content */}
              <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-md">
                <h3 className="text-lg font-semibold">Servicios del Día</h3>
                <p className="text-sm text-muted-foreground">Aquí se mostrarán los servicios asignados.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
};

export default VehicleDashboard;
