
import { CheckCircle, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FlowStep {
  id: string;
  label: string;
  completed: boolean;
  current?: boolean;
}

interface FlowProgressProps {
  steps: FlowStep[];
  currentStep: number;
  showLabels?: boolean;
  variant?: 'dots' | 'progress' | 'steps';
}

export function FlowProgress({ 
  steps, 
  currentStep, 
  showLabels = true, 
  variant = 'steps' 
}: FlowProgressProps) {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  if (variant === 'progress') {
    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Paso {currentStep} de {steps.length}</span>
          <span>{Math.round(progressPercentage)}% completado</span>
        </div>
        <Progress value={progressPercentage} className="w-full" />
        {showLabels && (
          <p className="text-sm font-medium">{steps[currentStep - 1]?.label}</p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex items-center justify-center space-x-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`w-3 h-3 rounded-full transition-colors ${
              index + 1 <= currentStep
                ? 'bg-primary'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                step.completed
                  ? 'bg-primary border-primary text-primary-foreground'
                  : index + 1 === currentStep
                  ? 'border-primary text-primary'
                  : 'border-muted text-muted-foreground'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              {showLabels && (
                <span className={`mt-2 text-xs text-center max-w-20 ${
                  index + 1 === currentStep ? 'font-medium' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${
                step.completed ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
