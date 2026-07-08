import { CheckIcon } from "lucide-react"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type StepState = "done" | "active" | "pending"

type ProcessingStep = {
  key: string
  label: string
  /** Optional live detail shown under the label while/after the step runs. */
  detail?: string
}

type ProcessingStepsProps = React.ComponentProps<"ol"> & {
  steps: ProcessingStep[]
  /** Index of the currently running step; steps before it render as done. */
  activeIndex: number
}

/**
 * Vertical progress stepper for long-running AI work (resume parsing, job
 * matching, analysis). Announces progress to assistive tech via aria-current
 * and a polite live region on the active step.
 */
function ProcessingSteps({
  steps,
  activeIndex,
  className,
  ...props
}: ProcessingStepsProps) {
  const stateFor = (index: number): StepState => {
    if (index < activeIndex) return "done"
    if (index === activeIndex) return "active"
    return "pending"
  }

  return (
    <ol
      data-slot="processing-steps"
      className={cn("grid gap-2", className)}
      {...props}
    >
      {steps.map((step, index) => {
        const state = stateFor(index)

        return (
          <li
            key={step.key}
            data-state={state}
            aria-current={state === "active" ? "step" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-transparent bg-muted/60 px-4 py-3 text-sm transition-colors",
              state === "active" && "border-border bg-card shadow-xs",
              state === "pending" && "text-muted-foreground"
            )}
          >
            {state === "done" ? (
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground"
                aria-hidden
              >
                <CheckIcon className="size-3" strokeWidth={3} />
              </span>
            ) : state === "active" ? (
              <Spinner className="size-5 shrink-0 text-accent-foreground" />
            ) : (
              <span
                className="mx-1 size-3 shrink-0 rounded-full border-2 border-border"
                aria-hidden
              />
            )}
            <span
              className="min-w-0"
              aria-live={state === "active" ? "polite" : undefined}
            >
              <span className={cn(state !== "pending" && "font-medium")}>
                {step.label}
              </span>
              {step.detail ? (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {step.detail}
                </span>
              ) : null}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export { ProcessingSteps, type ProcessingStep }
