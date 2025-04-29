
import { User } from "@/types";
import { DashboardActions } from "@/components/dashboard/DashboardActions";

interface DashboardHeaderProps {
  user: User;
}

export const DashboardHeader = ({ user }: DashboardHeaderProps) => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Bienvenido, {user.name}
      </h1>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>
        <DashboardActions user={user} />
      </div>
    </div>
  );
};
