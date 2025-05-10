
import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo />
            <p className="text-sm text-muted-foreground mt-2">
              © {new Date().getFullYear()} Gestión de Traslados Sanitarios
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Términos y condiciones
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Política de privacidad
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
