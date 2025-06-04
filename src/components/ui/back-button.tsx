
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";

interface BackButtonProps {
  to?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onConfirm?: () => boolean; // Retorna true si puede navegar
  confirmMessage?: string;
}

export function BackButton({ 
  to, 
  className = "", 
  variant = "outline",
  size = "sm",
  onConfirm,
  confirmMessage = "¿Estás seguro de que quieres salir? Podrías perder tu progreso."
}: BackButtonProps) {
  const { goBack, navigateToRole, canGoBack } = useSmartNavigation();

  const handleBack = () => {
    // Si hay una función de confirmación, ejecutarla
    if (onConfirm) {
      const canProceed = onConfirm();
      if (!canProceed) {
        const confirmed = window.confirm(confirmMessage);
        if (!confirmed) return;
      }
    }

    if (to) {
      navigateToRole(to);
    } else {
      goBack();
    }
  };

  // No mostrar el botón si no se puede/debe ir atrás
  if (!to && !canGoBack()) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Volver
    </Button>
  );
}
