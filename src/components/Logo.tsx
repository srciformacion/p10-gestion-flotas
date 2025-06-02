
import { Ambulance } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
      <div className="bg-white p-2 rounded h-10 flex items-center">
        <Ambulance className="h-6 w-6 text-rioja-green" />
      </div>
      <div className="text-white">
        <span className="font-heading font-bold text-lg block leading-tight">
          Gestión Ambulancias
        </span>
        <span className="text-xs opacity-90 block leading-tight">
          Gobierno de La Rioja
        </span>
      </div>
    </Link>
  );
};
