
import { Ambulance } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 text-primary-blue">
      <Ambulance className="h-6 w-6" />
      <span className="font-heading font-bold text-lg text-justify">App-P10</span>
    </Link>
  );
};
