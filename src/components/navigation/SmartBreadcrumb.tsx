
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface SmartBreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

export function SmartBreadcrumb({ items, showHome = true }: SmartBreadcrumbProps) {
  const location = useLocation();
  
  // Generar breadcrumbs automáticamente basado en la ruta
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Mapeo de rutas a nombres legibles
    const routeNames: Record<string, string> = {
      'dashboard': 'Dashboard',
      'solicitudes': 'Solicitudes',
      'nueva-solicitud': 'Nueva Solicitud',
      'ambulancias': 'Ambulancias',
      'usuarios': 'Usuarios',
      'rutas': 'Rutas',
      'seguimiento': 'Seguimiento',
      'despacho': 'Despacho IA',
      'equipo-movil': 'Equipo Móvil',
      'analiticas': 'Analíticas',
      'mensajes': 'Mensajes',
      'configuracion': 'Configuración',
      'perfil': 'Mi Perfil'
    };

    pathSegments.forEach((segment, index) => {
      const isLast = index === pathSegments.length - 1;
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      
      breadcrumbs.push({
        label: routeNames[segment] || segment,
        href: isLast ? undefined : href,
        isCurrentPage: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {showHome && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}
          </>
        )}
        
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.isCurrentPage ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink asChild>
                  <Link to={item.href!}>{item.label}</Link>
                </BreadcrumbLink>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
