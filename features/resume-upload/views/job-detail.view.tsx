"use client";

import Link from "next/link";

import { AppNavbar } from "@/components/app-navbar";
import { NavAuthActions } from "@/components/nav-auth-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { JobSearchResult } from "@/features/resume-upload/models/job-search.model";
import type {
  ResumeAnalysisResponse,
  ResumeAnalysisStatus,
} from "@/features/resume-upload/models/resume-analysis.model";
import { ResumeAnalysisSection } from "@/features/resume-upload/views/resume-analysis-section";

type JobDetailViewProps = {
  job: JobSearchResult | null;
  resumeId: string | null;
  analysisStatus: ResumeAnalysisStatus;
  analysisResult: ResumeAnalysisResponse | null;
  analysisError: string | null;
  onAnalyze: () => void;
};

const formatSalary = (salary: JobSearchResult["salary"]) => {
  if (!salary) return "Salary not listed";

  const formatter = new Intl.NumberFormat("en", { maximumFractionDigits: 0 });
  return `${salary.currency} ${formatter.format(salary.min)} – ${formatter.format(salary.max)} / ${salary.period}`;
};

export const JobDetailView = ({
  job,
  resumeId,
  analysisStatus,
  analysisResult,
  analysisError,
  onAnalyze,
}: JobDetailViewProps) => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppNavbar
        actions={
          <>
            <Button render={<Link href="/resumes" />} variant="outline">
              My Resumes
            </Button>
            <Button render={<Link href="/jobs" />} variant="secondary">
              Back to jobs
            </Button>
            <NavAuthActions />
          </>
        }
      />
      <section className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        {!job ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:py-32">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5f9d38]">
              Not found
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Job not found.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground sm:text-base">
              This job may have been removed or the session has expired. Go back
              and pick a role from your matched list.
            </p>
            <Button
              render={<Link href="/jobs" />}
              className="mt-8 h-12 w-full max-w-xs rounded-full px-8 sm:w-auto"
            >
              Back to matched jobs
            </Button>
          </div>
        ) : (
          <div className="py-10 sm:py-14 lg:py-20">
            <div className="mb-6 flex min-w-0 items-center gap-2 text-sm text-zinc-500 sm:mb-8">
              <Link href="/jobs" className="shrink-0 transition hover:text-zinc-950">
                Matched jobs
              </Link>
              <span className="shrink-0">/</span>
              <span className="truncate text-zinc-950">{job.title}</span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,360px)] lg:gap-10">
              <div>
                <Card className="rounded-2xl p-5 sm:rounded-3xl sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5f9d38]">
                        {job.company}
                      </p>
                      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                        {job.title}
                      </h1>
                      <p className="mt-3 text-sm font-medium text-muted-foreground sm:text-base">
                        {job.location}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      {typeof job.fit_score === "number" ? (
                        <Badge className="h-7 px-3 text-xs sm:px-4 sm:text-sm">
                          {job.fit_score}% fit
                        </Badge>
                      ) : null}
                      <Badge className="h-7 max-w-full bg-accent px-3 text-xs text-[#5f9d38] sm:px-4 sm:text-sm">
                        {formatSalary(job.salary)}
                      </Badge>
                    </div>
                  </div>

                  {job.url ? (
                    <Button
                      render={
                        <a href={job.url} target="_blank" rel="noreferrer noopener" />
                      }
                      className="mt-6 h-12 w-full gap-2 rounded-full px-6 text-sm sm:mt-7 sm:h-14 sm:w-auto sm:px-8 sm:text-base"
                    >
                      Apply for this job
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <path
                          d="M3 8H13M13 8L9 4M13 8L9 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  ) : null}
                </Card>

                <Card className="mt-4 rounded-2xl p-5 sm:mt-6 sm:rounded-3xl sm:p-8">
                  <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                    Job description
                  </h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:mt-4 sm:text-base sm:leading-8">
                    {job.description}
                  </p>
                </Card>
              </div>

              <div className="flex flex-col gap-4 sm:gap-6">
                {job.why_good_fit?.length ? (
                  <Card className="rounded-2xl p-5 sm:rounded-3xl sm:p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5f9d38]">
                      Why you&apos;re a good fit
                    </p>
                    <ul className="mt-4 grid gap-3">
                      {job.why_good_fit.map((reason) => (
                        <li key={reason} className="flex items-start gap-3">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          <span className="text-sm leading-6 text-zinc-700">
                            {reason}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ) : null}

                {job.possible_gaps?.length ? (
                  <Card className="rounded-2xl p-5 sm:rounded-3xl sm:p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
                      Possible gaps
                    </p>
                    <ul className="mt-4 grid gap-3">
                      {job.possible_gaps.map((gap) => (
                        <li key={gap} className="flex items-start gap-3">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                          <span className="text-sm leading-6 text-zinc-700">
                            {gap}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ) : null}

                {job.url ? (
                  <Button
                    render={
                      <a href={job.url} target="_blank" rel="noreferrer noopener" />
                    }
                    variant="outline"
                    className="h-12 w-full gap-2 rounded-full border-[#a9d98a] bg-accent px-6 text-sm hover:bg-[#d4f0be] sm:w-auto"
                  >
                    Apply for this job
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M3 8H13M13 8L9 4M13 8L9 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                ) : null}
              </div>
            </div>

            <ResumeAnalysisSection
              resumeId={resumeId}
              jobDescription={job.description ?? ""}
              status={analysisStatus}
              result={analysisResult}
              errorMessage={analysisError}
              onAnalyze={onAnalyze}
            />
          </div>
        )}
      </section>
    </main>
  );
};
