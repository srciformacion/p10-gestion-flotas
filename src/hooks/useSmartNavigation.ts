
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const useSmartNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const goBack = () => {
    // Si no hay historial o estamos en la página principal, ir al dashboard
    if (window.history.length <= 1 || location.pathname === '/dashboard') {
      navigate('/dashboard');
    } else {
      navigate(-1);
    }
  };

  const navigateToRole = (path: string) => {
    // Navegación inteligente basada en el rol
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirigir usuarios ya autenticados que van a login/registro
    if ((path === '/login' || path === '/registro') && user) {
      navigate('/dashboard');
      return;
    }

    navigate(path);
  };

  const canGoBack = () => {
    // No mostrar "atrás" en páginas principales o sin historial lógico
    const mainPages = ['/dashboard', '/', '/login', '/registro'];
    return !mainPages.includes(location.pathname) && window.history.length > 1;
  };

  const isCompletedFlow = (flowType: string) => {
    // Detectar si un flujo está completado para evitar retrocesos
    const completedFlows = sessionStorage.getItem('completedFlows');
    if (!completedFlows) return false;
    
    const flows = JSON.parse(completedFlows);
    return flows.includes(flowType);
  };

  const markFlowAsCompleted = (flowType: string) => {
    const completedFlows = sessionStorage.getItem('completedFlows');
    const flows = completedFlows ? JSON.parse(completedFlows) : [];
    
    if (!flows.includes(flowType)) {
      flows.push(flowType);
      sessionStorage.setItem('completedFlows', JSON.stringify(flows));
    }
  };

  return {
    goBack,
    navigateToRole,
    canGoBack,
    isCompletedFlow,
    markFlowAsCompleted
  };
};
