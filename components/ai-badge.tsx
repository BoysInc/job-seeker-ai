import { SparklesIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Marks AI-generated content (tailored summaries, suggestions, scores) so
 * users can always tell machine output from listed facts — a trust
 * requirement for an AI job platform.
 */
function AiBadge({
  children = "AI-generated",
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="ai-badge"
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center gap-1 rounded-md bg-accent px-1.5 text-xs font-medium text-accent-foreground",
        className
      )}
      {...props}
    >
      <SparklesIcon className="size-3" aria-hidden />
      {children}
    </span>
  )
}

export { AiBadge }
