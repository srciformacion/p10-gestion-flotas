
import { Logo } from "./Logo";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Logo />
              <span className="ml-2 text-lg font-medium text-gray-800">
                AmbulLink
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Sistema integral para la gestión eficiente de traslados sanitarios, conectando hospitales, pacientes y servicios de ambulancias.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              © {currentYear} AmbulLink - Todos los derechos reservados
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Inicio</a></li>
              <li><a href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">Iniciar Sesión</a></li>
              <li><a href="/registro" className="text-sm text-muted-foreground hover:text-primary transition-colors">Registrarse</a></li>
              <li><a href="/demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">Demostración</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Aviso Legal</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
