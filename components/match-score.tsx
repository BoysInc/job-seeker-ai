import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Match-score visualization for AI fit scores (0-100).
 *
 * One thresholds table drives every score surface in the app so a "72" is
 * always the same color whether it appears as a badge, a ring, or a bar.
 */
type ScoreBand = "strong" | "moderate" | "weak"

const SCORE_BANDS: { min: number; band: ScoreBand; label: string }[] = [
  { min: 75, band: "strong", label: "Strong match" },
  { min: 50, band: "moderate", label: "Moderate match" },
  { min: 0, band: "weak", label: "Weak match" },
]

function scoreBand(score: number): ScoreBand {
  return SCORE_BANDS.find((entry) => score >= entry.min)?.band ?? "weak"
}

function scoreBandLabel(score: number): string {
  return SCORE_BANDS.find((entry) => score >= entry.min)?.label ?? "Weak match"
}

const matchScoreBadgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-md border font-medium tabular-nums whitespace-nowrap",
  {
    variants: {
      band: {
        strong: "border-success/25 bg-success/10 text-success",
        moderate: "border-warning/25 bg-warning/10 text-warning",
        weak: "border-destructive/25 bg-destructive/10 text-destructive",
      },
      size: {
        sm: "h-5 px-1.5 text-xs",
        default: "h-6 px-2 text-xs",
        lg: "h-7 px-2.5 text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function MatchScoreBadge({
  score,
  showLabel = false,
  size,
  className,
  ...props
}: React.ComponentProps<"span"> &
  Omit<VariantProps<typeof matchScoreBadgeVariants>, "band"> & {
    score: number
    showLabel?: boolean
  }) {
  const band = scoreBand(score)

  return (
    <span
      data-slot="match-score-badge"
      data-band={band}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Match score: ${score} out of 100, ${scoreBandLabel(score)}`}
      className={cn(matchScoreBadgeVariants({ band, size, className }))}
      {...props}
    >
      {score}% fit
      {showLabel ? (
        <span className="font-normal opacity-80">
          · {scoreBandLabel(score)}
        </span>
      ) : null}
    </span>
  )
}

const RING_SIZES = {
  sm: { box: 48, stroke: 4, text: "text-sm" },
  default: { box: 72, stroke: 5, text: "text-xl" },
  lg: { box: 112, stroke: 7, text: "text-3xl" },
} as const

const ringColor: Record<ScoreBand, string> = {
  strong: "text-success",
  moderate: "text-warning",
  weak: "text-destructive",
}

function MatchScoreRing({
  score,
  size = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  score: number
  size?: keyof typeof RING_SIZES
}) {
  const band = scoreBand(score)
  const { box, stroke, text } = RING_SIZES[size]
  const radius = (box - stroke) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div
      data-slot="match-score-ring"
      data-band={band}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Match score: ${score} out of 100, ${scoreBandLabel(score)}`}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        ringColor[band],
        className
      )}
      style={{ width: box, height: box }}
      {...props}
    >
      <svg
        width={box}
        height={box}
        viewBox={`0 0 ${box} ${box}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span
        className={cn(
          "absolute font-semibold tabular-nums text-foreground",
          text
        )}
      >
        {score}
      </span>
    </div>
  )
}

const barColor: Record<ScoreBand, string> = {
  strong: "bg-success",
  moderate: "bg-warning",
  weak: "bg-destructive",
}

function ScoreBar({
  label,
  score,
  className,
  ...props
}: React.ComponentProps<"div"> & { label: string; score: number }) {
  const band = scoreBand(score)

  return (
    <div
      data-slot="score-bar"
      data-band={band}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${score} out of 100`}
      className={cn("grid gap-1.5", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-semibold tabular-nums text-muted-foreground">
          {score}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            barColor[band]
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

export {
  MatchScoreBadge,
  MatchScoreRing,
  ScoreBar,
  scoreBand,
  scoreBandLabel,
  matchScoreBadgeVariants,
}
