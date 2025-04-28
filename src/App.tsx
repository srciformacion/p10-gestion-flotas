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
              </ChatProvider>
            </RequestsProvider>
          </NotificationsWrapper>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
