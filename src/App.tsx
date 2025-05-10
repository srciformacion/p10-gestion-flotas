
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { RequestsProvider } from './context/requests';
import { ChatProvider } from './context/ChatContext';
import { NotificationsWrapper } from './components/notifications/NotificationsProvider';
import { ChatInterface } from './components/ChatInterface';
import { Toaster } from './components/ui/toaster';
import { Layout } from './components/Layout';

import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import RecoverPassword from './pages/RecoverPassword';
import UpdatePassword from './pages/UpdatePassword';
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
import Demo from './pages/Demo';
import DemoAccounts from './pages/DemoAccounts';

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
  const renderWithLayout = (component: React.ReactNode, showSidebar = true, showFooter = true) => {
    return (
      <Layout showSidebar={showSidebar} showFooter={showFooter}>
        {component}
      </Layout>
    );
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationsWrapper>
          <RequestsProvider>
            <ChatProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/recuperar-password" element={<RecoverPassword />} />
                <Route path="/actualizar-password" element={<UpdatePassword />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/demo-accounts" element={<DemoAccounts />} />
                
                {/* User routes with layout */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/solicitud" element={renderWithLayout(<NewRequest />)} />
                <Route path="/solicitud-avanzada" element={renderWithLayout(<NewAdvancedRequest />)} />
                <Route path="/solicitudes" element={renderWithLayout(<RequestList />)} />
                <Route path="/solicitudes/:id" element={renderWithLayout(<RequestDetail />)} />
                <Route path="/seguimiento/:requestId" element={renderWithLayout(<AmbulanceTracking />)} />
                <Route path="/ambulance-tracking/:requestId" element={renderWithLayout(<AmbulanceTracking />)} />
                <Route path="/perfil" element={renderWithLayout(<Profile />)} />
                <Route path="/mensajes" element={renderWithLayout(<ChatPage />)} />
                <Route path="/mensajes/:id" element={renderWithLayout(<ChatPage />)} />
                
                {/* Admin routes with layout */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={renderWithLayout(<AdminDashboard />)} />
                <Route path="/admin/empresas" element={renderWithLayout(<AdminCompanies />)} />
                <Route path="/admin/usuarios" element={renderWithLayout(<AdminUsers />)} />
                <Route path="/admin/solicitudes" element={renderWithLayout(<AdminRequests />)} />
                <Route path="/admin/vehiculos" element={renderWithLayout(<AdminVehicles />)} />
                <Route path="/admin/tracking" element={renderWithLayout(<VehicleTracking />)} />
                <Route path="/admin/bi" element={renderWithLayout(<BiDashboard />)} />
                <Route path="/admin/configuracion" element={renderWithLayout(<AdminSettings />)} />
                
                <Route path="/acceso-denegado" element={<AccessDenied />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Floating chat interface available on all pages */}
              <ChatInterface />
              
              {/* Toast notifications */}
              <Toaster />
            </ChatProvider>
          </RequestsProvider>
        </NotificationsWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
