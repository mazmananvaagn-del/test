"use client"

import { cn } from "@/lib/utils"

interface CheckoutStepsProps {
  currentStep: number
  steps: string[]
  onStepClick?: (step: number) => void
}

export function CheckoutSteps({ currentStep, steps, onStepClick }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              index + 1 === currentStep
                ? "border-primary text-primary"
                : index + 1 < currentStep
                  ? "border-primary text-primary"
                  : "border-muted text-muted-foreground",
            )}
            onClick={index + 1 <= currentStep ? () => onStepClick && onStepClick(index + 1) : undefined}
            role={index + 1 <= currentStep && onStepClick ? "button" : undefined}
            aria-disabled={index + 1 > currentStep}
            style={{ cursor: index + 1 <= currentStep && onStepClick ? 'pointer' : 'default' }}
          >
            {step}
          </div>
          {index < steps.length - 1 && <div className="w-8 h-px bg-muted mx-2" />}
        </div>
      ))}
    </div>
  )
}
