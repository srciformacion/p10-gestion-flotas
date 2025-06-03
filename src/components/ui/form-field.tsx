
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle } from "lucide-react";

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
  showValidIcon?: boolean;
  helpText?: string;
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
  className = "",
  showValidIcon = false,
  helpText
}: FormFieldProps) => {
  const inputId = `${name}-input`;
  const hasError = !!error;
  const isValid = !hasError && value && value.trim() !== '';

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={inputId} className={hasError ? "text-destructive" : ""}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <div className="relative">
        {multiline ? (
          <Textarea
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={hasError ? "border-destructive focus-visible:ring-destructive pr-10" : isValid && showValidIcon ? "border-green-500 pr-10" : ""}
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
            className={hasError ? "border-destructive focus-visible:ring-destructive pr-10" : isValid && showValidIcon ? "border-green-500 pr-10" : ""}
          />
        )}
        
        {hasError && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
        )}
        
        {isValid && showValidIcon && !hasError && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
      </div>
      
      {hasError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      {helpText && !hasError && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
};
