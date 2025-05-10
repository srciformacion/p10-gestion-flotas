
import { User } from "@/types";

interface WelcomeProps {
  name: string;
}

export const Welcome = ({ name }: WelcomeProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold">
        Bienvenido, {name}
      </h1>
      <p className="text-muted-foreground">
        Panel de gestión de traslados sanitarios
      </p>
    </div>
  );
};
