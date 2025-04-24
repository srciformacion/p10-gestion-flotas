
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { RequestsProvider } from "@/context/RequestsContext";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <RequestsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/nueva-solicitud" element={<NewRequest />} />
              <Route path="/solicitudes" element={<RequestList />} />
              <Route path="/solicitudes/:id" element={<RequestDetail />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/admin/empresas" element={<AdminCompanies />} />
              <Route path="/acceso-denegado" element={<AccessDenied />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RequestsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
