"use client";

import Link from "next/link";
import { FileTextIcon, SearchXIcon } from "lucide-react";

import { AppNavbar } from "@/components/app-navbar";
import { NavAuthActions } from "@/components/nav-auth-actions";
import { AiBadge } from "@/components/ai-badge";
import { JobCard } from "@/components/job-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { JobSearchResult } from "@/features/resume-upload/models/job-search.model";
import type { ResumeUploadResponse } from "@/features/resume-upload/models/resume-upload.model";

type JobSearchViewProps = {
  uploadedResume: ResumeUploadResponse | null;
  jobs: JobSearchResult[];
  onFindJobs: () => void;
};

const formatSalary = (salary: JobSearchResult["salary"]) => {
  if (!salary) {
    return null;
  }

  const formatter = new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
  });

  return `${salary.currency} ${formatter.format(salary.min)} – ${formatter.format(
    salary.max,
  )} / ${salary.period}`;
};

export const JobSearchView = ({
  uploadedResume,
  jobs,
  onFindJobs,
}: JobSearchViewProps) => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <AppNavbar
        actions={
          <>
            <Button render={<Link href="/resumes" />} variant="outline">
              My Resumes
            </Button>
            <Button render={<Link href="/" />} variant="secondary">
              Upload resume
            </Button>
            <NavAuthActions />
          </>
        }
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Jobs matched to your resume
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Ranked by AI fit score. Open a role to see why it matches, where
              you have gaps, and how to tailor your resume for it.
            </p>

            {uploadedResume ? (
              <Card size="sm" className="mt-6">
                <CardContent className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <FileTextIcon
                      className="size-4 shrink-0 text-accent-foreground"
                      aria-hidden
                    />
                    <p className="min-w-0 truncate text-sm font-medium">
                      {uploadedResume.fileName}
                    </p>
                  </div>
                  <div>
                    <AiBadge>AI summary</AiBadge>
                  </div>
                  <p className="line-clamp-4 text-xs leading-5 text-muted-foreground">
                    {uploadedResume.summary}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Empty className="mt-6 border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileTextIcon />
                  </EmptyMedia>
                  <EmptyTitle>No resume on this device</EmptyTitle>
                  <EmptyDescription>
                    Match jobs using the resume already saved to your
                    account, or upload a different one.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button type="button" onClick={onFindJobs} className="w-full">
                    Find jobs with my resume
                  </Button>
                  <Button
                    render={<Link href="/" />}
                    variant="outline"
                    className="w-full"
                  >
                    Upload a different resume
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {jobs.length > 0
                  ? `${jobs.length} recommended ${jobs.length === 1 ? "role" : "roles"}`
                  : "Recommended roles"}
              </h2>
              {jobs.length > 0 ? (
                <Badge variant="ghost" className="text-muted-foreground">
                  Sorted by fit
                </Badge>
              ) : null}
            </div>

            {uploadedResume && jobs.length === 0 ? (
              <Empty className="mt-4 border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchXIcon />
                  </EmptyMedia>
                  <EmptyTitle>No matching roles found</EmptyTitle>
                  <EmptyDescription>
                    We could not find open roles that match this resume right
                    now. Try again later, or upload a different resume version.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button type="button" onClick={onFindJobs} variant="outline">
                    Search again
                  </Button>
                </EmptyContent>
              </Empty>
            ) : null}

            {jobs.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {jobs.map((job) => (
                  <JobCard
                    key={job.job_id}
                    href={`/jobs/${encodeURIComponent(job.job_id)}`}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    salary={formatSalary(job.salary)}
                    description={job.description}
                    fitScore={
                      typeof job.fit_score === "number" ? job.fit_score : null
                    }
                    highlights={job.why_good_fit ?? undefined}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
};
