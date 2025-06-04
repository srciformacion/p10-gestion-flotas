
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { RequestsProvider } from "@/context/RequestsProvider";
import { ChatProvider } from "@/context/ChatContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { OptimizedLoader } from "@/components/OptimizedLoader";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NewRequest = lazy(() => import("./pages/NewRequest"));
const RequestList = lazy(() => import("./pages/RequestList"));
const RequestDetail = lazy(() => import("./pages/RequestDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const AccessDenied = lazy(() => import("./pages/AccessDenied"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RecoverPassword = lazy(() => import("./pages/RecoverPassword"));
const ChatPage = lazy(() => import("./pages/messages/ChatPage"));

// Admin pages
const AmbulanceList = lazy(() => import("./pages/ambulances/AmbulanceList"));
const AmbulanceDetail = lazy(() => import("./pages/ambulances/AmbulanceDetail"));
const UserManagement = lazy(() => import("./pages/users/UserManagement"));
const RouteManagement = lazy(() => import("./pages/routes/RouteManagement"));
const TrackingPage = lazy(() => import("./pages/tracking/TrackingPage"));
const DispatchPage = lazy(() => import("./pages/dispatch/DispatchPage"));
const AnalyticsPage = lazy(() => import("./pages/analytics/AnalyticsPage"));
const ConfigurationPage = lazy(() => import("./pages/configuration/ConfigurationPage"));
const MobileTeamDashboard = lazy(() => import("./pages/mobile/MobileTeamDashboard"));

// Driver pages
const BatchViewPage = lazy(() => import("./pages/driver/BatchViewPage"));
const RouteDetailsPage = lazy(() => import("./pages/driver/RouteDetailsPage"));

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <RequestsProvider>
          <ChatProvider>
            <Toaster />
            <Sonner />
            <PWAInstallPrompt />
            <BrowserRouter>
              <AppLayout>
                <Suspense fallback={<OptimizedLoader />}>
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
                    
                    {/* Driver specific routes */}
                    <Route path="/driver/batch-view/:loteId" element={<BatchViewPage />} />
                    <Route path="/driver/route-details/:loteId" element={<RouteDetailsPage />} />
                    
                    <Route path="/perfil" element={<Profile />} />
                    <Route path="/acceso-denegado" element={<AccessDenied />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AppLayout>
            </BrowserRouter>
          </ChatProvider>
        </RequestsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
