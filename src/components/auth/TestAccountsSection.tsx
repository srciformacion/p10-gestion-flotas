
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface TestAccountsSectionProps {
  onSelectAccount: (email: string) => void;
}

export const TestAccountsSection = ({ onSelectAccount }: TestAccountsSectionProps) => {
  const testAccounts = [
    { email: "admin@ambulink.com", role: "Administrador" },
    { email: "hospital@ambulink.com", role: "Centro sanitario" },
    { email: "usuario@ambulink.com", role: "Usuario particular" },
    { email: "ambulancia@ambulink.com", role: "Empresa de ambulancias" }
  ];

  return (
    <div className="w-full border-t pt-4">
      <p className="text-xs text-center text-gray-500 mb-2">
        Cuentas de prueba (usar contraseña: 123456)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {testAccounts.map((account) => (
          <Button
            key={account.email}
            variant="outline"
            size="sm"
            className="text-xs justify-start"
            onClick={() => onSelectAccount(account.email)}
          >
            <span className="truncate">{account.role}</span>
            <ArrowRight className="ml-auto h-3 w-3" />
          </Button>
        ))}
      </div>
    </div>
  );
};
