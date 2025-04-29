
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface StepsProps {
  steps: { title: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <div className={cn("flex w-full", className)}>
      {steps.map((step, index) => (
        <div 
          key={index}
          className={cn(
            "flex flex-col flex-1 transition-all relative", 
            index !== steps.length - 1 ? "after:content-[''] after:absolute after:top-4 after:w-full after:h-0.5 after:bg-muted after:translate-y-px after:z-0" : ""
          )}
        >
          <div className="flex items-center relative z-10">
            <div 
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-colors z-10",
                index < currentStep 
                  ? "bg-primary text-primary-foreground" 
                  : index === currentStep 
                    ? "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary" 
                    : "bg-muted text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            
            <div className="ml-4 hidden sm:block">
              <p 
                className={cn(
                  "text-sm font-medium leading-none", 
                  index <= currentStep ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
