
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RequestsProvider } from './context/requests';
import { ChatProvider } from './context/ChatContext';
import { NotificationsWrapper } from './components/notifications/NotificationsWrapper';
import { ChatInterface } from './components/ChatInterface';

import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import RecoverPassword from './pages/RecoverPassword';
import Dashboard from './pages/Dashboard';
import NewRequest from './pages/NewRequest';
import NewAdvancedRequest from './pages/NewAdvancedRequest';
import RequestList from './pages/RequestList';
import RequestDetail from './pages/RequestDetail';
import AmbulanceTracking from './pages/AmbulanceTracking';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';
import Profile from './pages/Profile';
import ChatPage from './pages/messages/ChatPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRequests from './pages/admin/AdminRequests';
import AdminSettings from './pages/admin/AdminSettings';
import AdminVehicles from './pages/admin/AdminVehicles';
import BiDashboard from './pages/admin/BiDashboard';
import VehicleTracking from './pages/admin/VehicleTracking';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationsWrapper>
          <RequestsProvider>
            <ChatProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/recuperar-password" element={<RecoverPassword />} />
                
                {/* Dashboard and user routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/solicitud" element={<NewRequest />} />
                <Route path="/solicitud-avanzada" element={<NewAdvancedRequest />} />
                <Route path="/solicitudes" element={<RequestList />} />
                <Route path="/solicitudes/:id" element={<RequestDetail />} />
                <Route path="/seguimiento/:requestId" element={<AmbulanceTracking />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/mensajes" element={<ChatPage />} />
                <Route path="/mensajes/:id" element={<ChatPage />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/empresas" element={<AdminCompanies />} />
                <Route path="/admin/usuarios" element={<AdminUsers />} />
                <Route path="/admin/solicitudes" element={<AdminRequests />} />
                <Route path="/admin/vehiculos" element={<AdminVehicles />} />
                <Route path="/admin/tracking" element={<VehicleTracking />} />
                <Route path="/admin/bi" element={<BiDashboard />} />
                <Route path="/admin/configuracion" element={<AdminSettings />} />
                
                <Route path="/acceso-denegado" element={<AccessDenied />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Floating chat interface available on all pages */}
              <ChatInterface />
            </ChatProvider>
          </RequestsProvider>
        </NotificationsWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
