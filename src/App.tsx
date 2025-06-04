import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { RequestsProvider } from '@/context/RequestsProvider';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import RequestList from '@/pages/RequestList';
import RequestDetail from '@/pages/RequestDetail';
import NewRequest from '@/pages/NewRequest';
import Profile from '@/pages/Profile';
import AdminUsers from '@/pages/admin/AdminUsers';
import { ChatProvider } from '@/context/ChatContext';
import ChatPage from '@/pages/messages/ChatPage';
import { Toaster } from "@/components/ui/toaster"
import { NotificationProvider } from '@/context/NotificationContext';

// Import all new pages
import AmbulanceManagement from '@/pages/ambulances/AmbulanceManagement';
import UserManagementPage from '@/pages/users/UserManagementPage';
import RoutePlanningPage from '@/pages/routes/RoutePlanningPage';
import TrackingDashboard from '@/pages/tracking/TrackingDashboard';
import DispatchCenter from '@/pages/dispatch/DispatchCenter';
import MobileTeamPage from '@/pages/mobile/MobileTeamPage';
import AnalyticsPage from '@/pages/analytics/AnalyticsPage';
import ConfigurationPage from '@/pages/configuration/ConfigurationPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <RequestsProvider>
            <ChatProvider>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/registro" element={<RegisterPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/solicitudes" element={<RequestList />} />
                  <Route path="/solicitud/:id" element={<RequestDetail />} />
                  <Route path="/nueva-solicitud" element={<NewRequest />} />
                  <Route path="/perfil" element={<Profile />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/usuarios" element={<UserManagementPage />} />

                  {/* Main App Pages */}
                  <Route path="/ambulancias" element={<AmbulanceManagement />} />
                  <Route path="/rutas" element={<RoutePlanningPage />} />
                  <Route path="/seguimiento" element={<TrackingDashboard />} />
                  <Route path="/despacho" element={<DispatchCenter />} />
                  <Route path="/equipo-movil" element={<MobileTeamPage />} />
                  <Route path="/analiticas" element={<AnalyticsPage />} />
                  <Route path="/configuracion" element={<ConfigurationPage />} />

                  {/* Chat Routes */}
                  <Route path="/mensajes" element={<ChatPage />} />

                  {/* Redirect invalid paths to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
                <Toaster />
              </div>
            </ChatProvider>
          </RequestsProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
