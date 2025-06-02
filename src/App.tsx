
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { RequestsProvider } from "@/context/RequestsContext";
import { ChatProvider } from "@/context/ChatContext";
import { AppLayout } from "@/components/layout/AppLayout";

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
import RecoverPassword from "./pages/RecoverPassword";
import ChatPage from "./pages/messages/ChatPage";

// Nuevas páginas para el sistema completo
import AmbulanceList from "./pages/ambulances/AmbulanceList";
import AmbulanceDetail from "./pages/ambulances/AmbulanceDetail";
import UserManagement from "./pages/users/UserManagement";
import RouteManagement from "./pages/routes/RouteManagement";
import TrackingPage from "./pages/tracking/TrackingPage";
import DispatchPage from "./pages/dispatch/DispatchPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import ConfigurationPage from "./pages/configuration/ConfigurationPage";
import MobileTeamDashboard from "./pages/mobile/MobileTeamDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <RequestsProvider>
          <ChatProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registro" element={<Register />} />
                  <Route path="/recuperar-password" element={<RecoverPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/nueva-solicitud" element={<NewRequest />} />
                  <Route path="/solicitudes" element={<RequestList />} />
                  <Route path="/solicitudes/:id" element={<RequestDetail />} />
                  <Route path="/ambulancias" element={<AmbulanceList />} />
                  <Route path="/ambulancias/:id" element={<AmbulanceDetail />} />
                  <Route path="/usuarios" element={<UserManagement />} />
                  <Route path="/rutas" element={<RouteManagement />} />
                  <Route path="/seguimiento" element={<TrackingPage />} />
                  <Route path="/despacho" element={<DispatchPage />} />
                  <Route path="/analiticas" element={<AnalyticsPage />} />
                  <Route path="/mensajes" element={<ChatPage />} />
                  <Route path="/configuracion" element={<ConfigurationPage />} />
                  <Route path="/equipo-movil" element={<MobileTeamDashboard />} />
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/acceso-denegado" element={<AccessDenied />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            </BrowserRouter>
          </ChatProvider>
        </RequestsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
