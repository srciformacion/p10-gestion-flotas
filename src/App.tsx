
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { RequestsProvider } from "@/context/RequestsContext";
import { ChatProvider } from "@/context/ChatContext";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { NotificationsWrapper } from "@/components/notifications/NotificationsWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RequireAuth } from "@/components/RequireAuth";
import { UserRole } from "@/types";

// Import page components
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RecoverPassword from "@/pages/RecoverPassword";
import Dashboard from "@/pages/Dashboard";
import NewRequest from "@/pages/NewRequest";
import RequestList from "@/pages/RequestList";
import RequestDetail from "@/pages/RequestDetail";
import Profile from "@/pages/Profile";
import ChatPage from "@/pages/messages/ChatPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminCompanies from "@/pages/admin/AdminCompanies";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminRequests from "@/pages/admin/AdminRequests";
import AdminVehicles from "@/pages/admin/AdminVehicles";
import AdminSettings from "@/pages/admin/AdminSettings";
import BiDashboard from "@/pages/admin/BiDashboard";
import AccessDenied from "@/pages/AccessDenied";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationsWrapper>
            <RequestsProvider>
              <ChatProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Register />} />
                    <Route path="/recuperar-password" element={<RecoverPassword />} />
                    
                    {/* Rutas protegidas que requieren autenticación */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <RequireAuth>
                          <Dashboard />
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/nueva-solicitud" 
                      element={
                        <RequireAuth allowedRoles={['hospital', 'individual']}>
                          <NewRequest />
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/solicitudes" 
                      element={
                        <RequireAuth>
                          <RequestList />
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/solicitudes/:id" 
                      element={
                        <RequireAuth>
                          <RequestDetail />
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/perfil" 
                      element={
                        <RequireAuth>
                          <Profile />
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/mensajes" 
                      element={
                        <RequireAuth>
                          <ChatPage />
                        </RequireAuth>
                      } 
                    />
                    
                    {/* Rutas de administración protegidas */}
                    <Route 
                      path="/admin" 
                      element={
                        <RequireAuth allowedRoles={['admin']}>
                          <AdminDashboard />
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/admin/empresas" 
                      element={
                        <RequireAuth allowedRoles={['admin']}>
                          <AdminCompanies />
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/admin/usuarios" 
                      element={
                        <RequireAuth allowedRoles={['admin']}>
                          <AdminUsers />
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/admin/solicitudes" 
                      element={
                        <RequireAuth allowedRoles={['admin']}>
                          <AdminRequests />
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/admin/vehiculos" 
                      element={
                        <RequireAuth allowedRoles={['admin']}>
                          <AdminVehicles />
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/admin/configuracion" 
                      element={
                        <RequireAuth allowedRoles={['admin']}>
                          <AdminSettings />
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/admin/bi" 
                      element={
                        <RequireAuth allowedRoles={['admin']}>
                          <BiDashboard />
                        </RequireAuth>
                      } 
                    />
                    
                    <Route path="/acceso-denegado" element={<AccessDenied />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
                <ChatInterface />
              </ChatProvider>
            </RequestsProvider>
          </NotificationsWrapper>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
