import Link from "next/link"
import { ArrowUpRightIcon, BuildingIcon, MapPinIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { MatchScoreBadge } from "@/components/match-score"
import { cn } from "@/lib/utils"

type JobCardProps = React.ComponentProps<"article"> & {
  title: string
  company: string
  location: string
  href: string
  description?: string
  /** Pre-formatted salary label, e.g. "AED 18,000 – 24,000 / month". */
  salary?: string | null
  fitScore?: number | null
  /** AI "why you're a good fit" reasons; first two are shown. */
  highlights?: string[]
}

/**
 * Job listing card for search results and recommendations.
 *
 * The title is the accessible link; a stretched pseudo-element makes the
 * whole card clickable without wrapping everything in an anchor, so screen
 * readers announce one clean link per job and inner links stay possible.
 */
function JobCard({
  title,
  company,
  location,
  href,
  description,
  salary,
  fitScore,
  highlights,
  className,
  ...props
}: JobCardProps) {
  return (
    <article
      data-slot="job-card"
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-xs transition-shadow hover:border-ring/60 hover:shadow-md has-[a:focus-visible]:border-ring has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/50 sm:p-5",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-balance sm:text-lg">
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:rounded-xl"
            >
              {title}
            </Link>
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <BuildingIcon className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{company}</span>
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPinIcon className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{location}</span>
            </span>
          </div>
        </div>
        {typeof fitScore === "number" ? (
          <MatchScoreBadge score={fitScore} className="mt-0.5" />
        ) : null}
      </div>

      {salary ? (
        <div>
          <Badge variant="outline" className="h-6 rounded-md font-medium">
            {salary}
          </Badge>
        </div>
      ) : null}

      {description ? (
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}

      {highlights?.length ? (
        <ul className="grid gap-1.5">
          {highlights.slice(0, 2).map((reason) => (
            <li
              key={reason}
              className="flex items-start gap-2 text-sm leading-5 text-muted-foreground"
            >
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
              <span className="min-w-0">{reason}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <span
        className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-accent-foreground opacity-0 transition-opacity group-hover:opacity-100 group-has-[a:focus-visible]:opacity-100"
        aria-hidden
      >
        View details
        <ArrowUpRightIcon className="size-3.5" />
      </span>
    </article>
  )
}

export { JobCard }
