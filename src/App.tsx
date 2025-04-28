
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

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewRequest from "./pages/NewRequest";
import RequestList from "./pages/RequestList";
import RequestDetail from "./pages/RequestDetail";
import Profile from "./pages/Profile";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminVehicles from "./pages/admin/AdminVehicles";
import BiDashboard from "./pages/admin/BiDashboard";
import RecoverPassword from "./pages/RecoverPassword";
import ChatPage from "./pages/messages/ChatPage";

const queryClient = new QueryClient();

const App = () => (
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
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/nueva-solicitud" element={<NewRequest />} />
                  <Route path="/solicitudes" element={<RequestList />} />
                  <Route path="/solicitudes/:id" element={<RequestDetail />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/mensajes" element={<ChatPage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/empresas" element={<AdminCompanies />} />
                  <Route path="/admin/usuarios" element={<AdminUsers />} />
                  <Route path="/admin/solicitudes" element={<AdminRequests />} />
                  <Route path="/admin/vehiculos" element={<AdminVehicles />} />
                  <Route path="/admin/configuracion" element={<AdminSettings />} />
                  <Route path="/admin/bi" element={<BiDashboard />} />
                  <Route path="/acceso-denegado" element={<AccessDenied />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ChatInterface />
              </BrowserRouter>
            </ChatProvider>
          </RequestsProvider>
        </NotificationsWrapper>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
