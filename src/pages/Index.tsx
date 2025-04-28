import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Bienvenido a la App de Ambulancias
        </h1>
        <p className="text-muted-foreground">
          La solución integral para la gestión eficiente de traslados sanitarios.
        </p>
        <div className="flex gap-4">
          <Link to="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
          <Link to="/registro">
            <Button variant="outline">Crear Cuenta</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
