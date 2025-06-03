
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  className?: string;
}

export const FormField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  type = "text",
  placeholder,
  disabled = false,
  multiline = false,
  className = ""
}: FormFieldProps) => {
  const inputId = `${name}-input`;
  const hasError = !!error;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={inputId} className={hasError ? "text-destructive" : ""}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {multiline ? (
        <Textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={hasError ? "border-destructive focus-visible:ring-destructive" : ""}
        />
      ) : (
        <Input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={hasError ? "border-destructive focus-visible:ring-destructive" : ""}
        />
      )}
      
      {hasError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
