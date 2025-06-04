
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExitConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  hasUnsavedChanges?: boolean;
}

export function ExitConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Salir sin guardar?",
  message = "Tienes cambios sin guardar. Si sales ahora, se perderán todos los cambios.",
  hasUnsavedChanges = true
}: ExitConfirmationProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasUnsavedChanges ? message : "¿Estás seguro de que quieres salir?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {hasUnsavedChanges ? "Salir sin guardar" : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
