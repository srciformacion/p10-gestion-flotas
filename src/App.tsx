
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Role definitions for different routes
const ADMIN_ROLE: UserRole[] = ["admin"];
const HOSPITAL_ROLES: UserRole[] = ["hospital", "admin"];
const AMBULANCE_ROLES: UserRole[] = ["ambulance", "admin"];
const INDIVIDUAL_ROLES: UserRole[] = ["individual", "admin"];
const CLIENT_ROLES: UserRole[] = ["hospital", "individual", "admin"];
const ALL_AUTH_ROLES: UserRole[] = ["admin", "hospital", "ambulance", "individual"];

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
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Register />} />
                    <Route path="/recuperar-password" element={<RecoverPassword />} />
                    <Route path="/acceso-denegado" element={<AccessDenied />} />
                    
                    {/* Dashboard based on role */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <RequireAuth allowedRoles={["admin", "hospital", "ambulance"]}>
                          <Dashboard />
                        </RequireAuth>
                      } 
                    />

                    {/* Individual users are redirected to solicitudes instead of dashboard */}
                    <Route
                      path="/individual-redirect"
                      element={
                        <RequireAuth allowedRoles={["individual"]}>
                          <Navigate to="/solicitudes" replace />
                        </RequireAuth>
                      }
                    />
                    
                    {/* Create new request - only for clients */}
                    <Route 
                      path="/nueva-solicitud" 
                      element={
                        <RequireAuth allowedRoles={CLIENT_ROLES}>
                          <NewRequest />
                        </RequireAuth>
                      } 
                    />
                    
                    {/* Requests - all authenticated users, but filtering based on role happens within */}
                    <Route 
                      path="/solicitudes" 
                      element={
                        <RequireAuth allowedRoles={ALL_AUTH_ROLES}>
                          <RequestList />
                        </RequireAuth>
                      } 
                    />
                    
                    <Route 
                      path="/solicitudes/:id" 
                      element={
                        <RequireAuth allowedRoles={ALL_AUTH_ROLES}>
                          <RequestDetail />
                        </RequireAuth>
                      } 
                    />
                    
                    {/* Profile - all authenticated users */}
                    <Route 
                      path="/perfil" 
                      element={
                        <RequireAuth allowedRoles={ALL_AUTH_ROLES}>
                          <Profile />
                        </RequireAuth>
                      } 
                    />
                    
                    {/* Messages - all authenticated users */}
                    <Route 
                      path="/mensajes" 
                      element={
                        <RequireAuth allowedRoles={ALL_AUTH_ROLES}>
                          <ChatPage />
                        </RequireAuth>
                      } 
                    />
                    
                    {/* Admin routes - Admin only */}
                    <Route 
                      path="/admin" 
                      element={
                        <RequireAuth allowedRoles={ADMIN_ROLE}>
                          <AdminDashboard />
                        </RequireAuth>
                      } 
                    />
                    
                    <Route 
                      path="/admin/empresas" 
                      element={
                        <RequireAuth allowedRoles={ADMIN_ROLE}>
                          <AdminCompanies />
                        </RequireAuth>
                      } 
                    />
                    
                    <Route 
                      path="/admin/usuarios" 
                      element={
                        <RequireAuth allowedRoles={ADMIN_ROLE}>
                          <AdminUsers />
                        </RequireAuth>
                      } 
                    />
                    
                    <Route 
                      path="/admin/solicitudes" 
                      element={
                        <RequireAuth allowedRoles={ADMIN_ROLE}>
                          <AdminRequests />
                        </RequireAuth>
                      } 
                    />
                    
                    {/* Vehicle management - Admin and Ambulance companies */}
                    <Route 
                      path="/admin/vehiculos" 
                      element={
                        <RequireAuth allowedRoles={["admin", "ambulance"]}>
                          <AdminVehicles />
                        </RequireAuth>
                      } 
                    />
                    
                    <Route 
                      path="/admin/configuracion" 
                      element={
                        <RequireAuth allowedRoles={ADMIN_ROLE}>
                          <AdminSettings />
                        </RequireAuth>
                      } 
                    />
                    
                    <Route 
                      path="/admin/bi" 
                      element={
                        <RequireAuth allowedRoles={ADMIN_ROLE}>
                          <BiDashboard />
                        </RequireAuth>
                      } 
                    />
                    
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
