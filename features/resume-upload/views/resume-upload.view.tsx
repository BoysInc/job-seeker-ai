"use client";

import Link from "next/link";

import { AiBadge } from "@/components/ai-badge";
import { AppNavbar } from "@/components/app-navbar";
import { FileDropzone } from "@/components/file-dropzone";
import { NavAuthActions } from "@/components/nav-auth-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatFileSize } from "@/features/resume-upload/models/resume-upload.model";

type ResumeUploadViewProps = {
  selectedFile: File | null;
  selectedFileSizeLabel: string | null;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  errorMessage: string | null;
  successMessage: string | null;
  uploadedResume: {
    uploadedAt: string;
    fileName: string;
    fileSize: number;
    summary: string;
  } | null;
  isUploading: boolean;
  onFilePick: (file: File | null) => void;
  onUpload: () => Promise<void>;
  onReset: () => void;
  onFindJobs: () => void;
};

export const ResumeUploadView = ({
  selectedFile,
  selectedFileSizeLabel,
  uploadStatus,
  errorMessage,
  successMessage,
  uploadedResume,
  isUploading,
  onFilePick,
  onUpload,
  onReset,
  onFindJobs,
}: ResumeUploadViewProps) => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppNavbar
        centerLinks={[{ href: "#workflow", label: "How it works" }]}
        actions={
          <>
            <Button render={<Link href="/resumes" />} variant="outline">
              My Resumes
            </Button>
            <NavAuthActions />
          </>
        }
      />
      <section className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 py-10 sm:gap-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cfe9b8] bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              AI job matching in under 60 seconds
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Find your best-fit jobs, matched by AI.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
              We match the resume already on file against live openings and
              score each one for fit. Upload a new resume any time you want a
              fresh match.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={onFindJobs}
                className="h-14 rounded-full px-8 text-base"
              >
                Find matching jobs
              </Button>
              <Button
                render={<a href="#workflow" />}
                variant="outline"
                className="h-14 rounded-full px-8 text-base"
              >
                See how it works
              </Button>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["92%", "average ATS lift"],
                ["4.8/5", "review quality"],
                ["12k+", "resumes analyzed"],
              ].map(([metric, label]) => (
                <Card key={label} className="rounded-3xl p-4">
                  <p className="text-2xl font-semibold">{metric}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="rounded-3xl p-4 shadow-2xl shadow-[#cfe9b8]/40 sm:rounded-4xl sm:p-5">
            <div className="rounded-2xl bg-zinc-950 p-5 text-white sm:rounded-3xl sm:p-6">
              <AiBadge className="bg-white/10 text-primary">
                AI matching
              </AiBadge>
              <h2 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
                Find jobs with your resume on file
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                We&apos;ll match your active resume against live openings and
                score each one for fit — no upload needed.
              </p>
              <Button
                type="button"
                onClick={onFindJobs}
                variant="secondary"
                className="mt-5 h-12 w-full rounded-full text-sm sm:h-14 sm:text-base"
              >
                Find matching jobs
              </Button>
            </div>

            {errorMessage ? (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            {successMessage && uploadedResume ? (
              <Alert className="mt-4 border-[#d4e9c4] bg-[#f0fdf4] **:data-[slot=alert-description]:text-green-800">
                <AlertDescription>
                  <p className="font-semibold text-green-800">
                    {successMessage}
                  </p>
                  <p className="mt-1">
                    Converted {uploadedResume.fileName} (
                    {formatFileSize(uploadedResume.fileSize)})
                  </p>
                  <p className="mt-2 line-clamp-3 text-xs text-green-700">
                    {uploadedResume.summary}
                  </p>
                  <p className="mt-1 text-xs text-green-700">
                    Uploaded at{" "}
                    {new Date(uploadedResume.uploadedAt).toLocaleString()}
                  </p>
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="mt-4 rounded-2xl border border-dashed border-border p-4 sm:rounded-3xl sm:p-5">
              <p className="text-sm font-semibold">
                Or upload a different resume
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                This becomes your new active resume.
              </p>

              <FileDropzone
                file={selectedFile}
                fileMeta={
                  selectedFile
                    ? selectedFileSizeLabel ?? formatFileSize(selectedFile.size)
                    : null
                }
                onFileSelect={onFilePick}
                className="mt-3"
              />

              {selectedFile ? (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    onClick={onUpload}
                    disabled={isUploading}
                    className="h-11 w-full rounded-full text-sm sm:flex-1"
                  >
                    {uploadStatus === "uploading"
                      ? "Uploading..."
                      : "Analyze & find jobs"}
                  </Button>
                  <Button
                    type="button"
                    onClick={onReset}
                    variant="outline"
                    className="h-11 w-full rounded-full text-sm sm:w-auto"
                  >
                    Reset
                  </Button>
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <section
          id="workflow"
          className="grid gap-4 pb-10 sm:grid-cols-2 sm:pb-16 md:grid-cols-3 lg:pb-24"
        >
          {[
            [
              "01",
              "Find matching jobs",
              "Use the resume already on file to match against live openings and get a fit score for each.",
            ],
            [
              "02",
              "Tailor for each role",
              "Open any match to see why it fits, where you have gaps, and how to tailor your resume for it.",
            ],
            [
              "03",
              "Upload when you need to",
              "Have a newer resume? Upload it any time — it becomes your active resume for future matches.",
            ],
          ].map(([step, title, description]) => (
            <Card key={step} className="rounded-[1.75rem] p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-bold text-[#5f9d38]">
                {step}
              </span>
              <h2 className="mt-6 text-xl font-semibold tracking-tight sm:text-2xl">
                {title}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                {description}
              </p>
            </Card>
          ))}
        </section>

        <section
          id="insights"
          className="mb-6 rounded-3xl bg-zinc-950 p-5 text-white sm:mb-10 sm:rounded-4xl sm:p-6 md:p-10"
        >
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                AI insights
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl">
                Know exactly what to fix before you apply.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Missing measurable outcomes in 3 experience bullets",
                "Add Python, SQL, and stakeholder management keywords",
                "Summary is too generic for product analyst roles",
                "Move strongest achievements into the first page",
              ].map((insight) => (
                <div key={insight} className="rounded-2xl bg-white/10 p-4">
                  <span className="mb-3 block h-2 w-2 rounded-full bg-primary" />
                  <p className="text-sm leading-6 text-zinc-200">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};
