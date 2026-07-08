"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  GapSeverity,
  ResumeAnalysisResponse,
  ResumeAnalysisStatus,
  UpdatePriority,
} from "@/features/resume-upload/models/resume-analysis.model";

type ResumeAnalysisSectionProps = {
  resumeId: string | null;
  jobDescription: string;
  status: ResumeAnalysisStatus;
  result: ResumeAnalysisResponse | null;
  errorMessage: string | null;
  onAnalyze: () => void;
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-[#5f9d38]";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
};

const scoreBarColor = (score: number) => {
  if (score >= 80) return "bg-primary";
  if (score >= 60) return "bg-amber-400";
  return "bg-red-400";
};

const severityStyles: Record<GapSeverity, { badge: string; dot: string }> = {
  low: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  medium: { badge: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  high: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

const priorityStyles: Record<UpdatePriority, { badge: string }> = {
  low: { badge: "bg-muted text-zinc-600" },
  medium: { badge: "bg-amber-100 text-amber-700" },
  high: { badge: "bg-red-100 text-red-700" },
};

const scoreLabels: Record<keyof ResumeAnalysisResponse["scores"], string> = {
  skills_match: "Skills match",
  experience_match: "Experience",
  keyword_match: "Keywords",
  seniority_match: "Seniority",
  impact_and_metrics: "Impact & metrics",
  format_and_clarity: "Format & clarity",
};

export const ResumeAnalysisSection = ({
  resumeId,
  status,
  result,
  errorMessage,
  onAnalyze,
}: ResumeAnalysisSectionProps) => {
  if (!resumeId) {
    return (
      <Card className="mt-8 rounded-2xl p-6 text-center sm:mt-10 sm:rounded-3xl sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Resume analysis
        </p>
        <p className="mt-3 text-muted-foreground">
          Upload your resume first to run an AI analysis against this job.
        </p>
      </Card>
    );
  }

  return (
    <div className="mt-8 sm:mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5f9d38]">
            AI resume analysis
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
            How well does your resume match this job?
          </h2>
        </div>

        <Button
          type="button"
          onClick={onAnalyze}
          disabled={status === "loading"}
          variant="secondary"
          className="h-12 w-full shrink-0 gap-2 rounded-full px-7 text-sm sm:w-auto"
        >
          {status === "loading" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Analyzing…
            </>
          ) : status === "success" ? (
            "Re-analyze"
          ) : (
            "Analyze my resume"
          )}
        </Button>
      </div>

      {/* Error */}
      {status === "error" && errorMessage ? (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {/* Loading skeleton */}
      {status === "loading" ? (
        <div className="mt-6 grid gap-4">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      ) : null}

      {/* Results */}
      {status === "success" && result ? (
        <div className="mt-6 grid gap-6">
          {/* Overall score + score breakdown */}
          <Card className="rounded-2xl p-5 sm:rounded-3xl sm:p-8">
            <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start">
              <div className="flex shrink-0 flex-col items-center gap-2">
                <div
                  className={`text-5xl font-semibold tabular-nums sm:text-6xl ${scoreColor(result.overall_score)}`}
                >
                  {result.overall_score}
                  <span className="text-2xl text-zinc-400">/100</span>
                </div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Overall score
                </p>
              </div>

              {/* Score bars */}
              <div className="flex-1 grid gap-3">
                {(
                  Object.entries(result.scores) as [
                    keyof typeof result.scores,
                    number,
                  ][]
                ).map(([key, value]) => (
                  <div key={key} className="grid gap-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-zinc-700">
                        {scoreLabels[key]}
                      </span>
                      <span className={`font-semibold ${scoreColor(value)}`}>
                        {value}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${scoreBarColor(value)}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <p className="mt-6 rounded-2xl bg-muted p-4 text-sm leading-7 text-zinc-700">
              {result.summary}
            </p>
          </Card>

          {/* Tailored summary */}
          {result.tailored_resume_summary ? (
            <Card className="rounded-2xl p-5 sm:rounded-3xl sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5f9d38]">
                Tailored resume summary
              </p>
              <p className="mt-4 leading-7 text-zinc-700">
                {result.tailored_resume_summary}
              </p>
            </Card>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Strengths */}
            {result.strengths.length ? (
              <Card className="rounded-2xl p-5 sm:rounded-3xl sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5f9d38]">
                  Strengths
                </p>
                <ul className="mt-4 grid gap-5">
                  {result.strengths.map((s) => (
                    <li key={s.title} className="grid gap-1">
                      <p className="font-semibold text-zinc-900">{s.title}</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {s.evidence}
                      </p>
                      <p className="text-xs italic text-zinc-500">
                        {s.why_it_matters}
                      </p>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {/* Gaps */}
            {result.gaps.length ? (
              <Card className="rounded-2xl p-5 sm:rounded-3xl sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
                  Gaps
                </p>
                <ul className="mt-4 grid gap-5">
                  {result.gaps.map((g) => (
                    <li key={g.title} className="grid gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${severityStyles[g.severity].dot}`}
                        />
                        <p className="min-w-0 font-semibold text-zinc-900">{g.title}</p>
                        <Badge
                          variant="outline"
                          className={`ml-auto capitalize ${severityStyles[g.severity].badge}`}
                        >
                          {g.severity}
                        </Badge>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {g.evidence}
                      </p>
                      <p className="text-xs font-medium text-zinc-500">
                        {g.recommendation}
                      </p>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </div>

          {/* Keywords */}
          <Card className="rounded-2xl p-5 sm:rounded-3xl sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5f9d38]">
              Keywords
            </p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {result.keywords_to_add.length ? (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-600">
                    Missing — add these
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords_to_add.map((kw) => (
                      <Badge
                        key={kw}
                        variant="outline"
                        className="border-red-200 bg-red-50 text-red-700"
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
              {result.keywords_already_present.length ? (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5f9d38]">
                    Already present
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords_already_present.map((kw) => (
                      <Badge
                        key={kw}
                        variant="outline"
                        className="border-[#d4e9c4] bg-accent text-[#5f9d38]"
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </Card>

          {/* Recommended updates */}
          {result.recommended_updates.length ? (
            <Card className="rounded-2xl p-5 sm:rounded-3xl sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5f9d38]">
                Recommended updates
              </p>
              <ul className="mt-5 grid gap-6">
                {result.recommended_updates.map((u) => (
                  <li
                    key={`${u.section}-${u.current_issue}`}
                    className="rounded-2xl border border-zinc-100 bg-[#fbfef8] p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="min-w-0 font-semibold text-zinc-900">{u.section}</p>
                      <Badge
                        className={`ml-auto capitalize ${priorityStyles[u.priority].badge}`}
                      >
                        {u.priority}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-zinc-800">Issue: </span>
                      {u.current_issue}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-medium text-zinc-800">Fix: </span>
                      {u.suggested_change}
                    </p>
                    {u.example_rewrite ? (
                      <p className="mt-3 rounded-xl bg-white p-3 text-xs leading-5 text-zinc-500 ring-1 ring-zinc-100">
                        {u.example_rewrite}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {/* Final recommendation */}
          {result.final_recommendation ? (
            <div className="rounded-2xl bg-zinc-950 p-6 text-white sm:rounded-3xl sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Final recommendation
              </p>
              <p className="mt-4 leading-7 text-zinc-200">
                {result.final_recommendation}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
