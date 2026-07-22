"use client";

import Link from "next/link";
import { useState } from "react";

import { AppNavbar } from "@/components/app-navbar";
import { FileDropzone } from "@/components/file-dropzone";
import { NavAuthActions } from "@/components/nav-auth-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatFileSize,
  type ResumeSummary,
} from "@/features/resume-upload/models/resume-upload.model";
import type { ResumeListStatus } from "@/features/resume-upload/store/resume-list.store";

type ResumeListViewProps = {
  resumes: ResumeSummary[];
  status: ResumeListStatus;
  errorMessage: string | null;
  activatingId: string | null;
  deletingId: string | null;
  viewingId: string | null;
  downloadingId: string | null;
  selectedFile: File | null;
  uploadErrorMessage: string | null;
  isLoading: boolean;
  isUploading: boolean;
  onActivate: (resumeId: string) => void;
  onDelete: (resumeId: string) => void;
  onFindJobs: (resumeId: string) => void;
  onView: (resumeId: string) => void;
  onDownload: (resumeId: string) => void;
  onFilePick: (file: File | null) => void;
  onUploadNew: () => void;
};

const formatUploadedAt = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }
  return date.toLocaleString();
};

export const ResumeListView = ({
  resumes,
  status,
  errorMessage,
  activatingId,
  deletingId,
  viewingId,
  downloadingId,
  selectedFile,
  uploadErrorMessage,
  isLoading,
  isUploading,
  onActivate,
  onDelete,
  onFindJobs,
  onView,
  onDownload,
  onFilePick,
  onUploadNew,
}: ResumeListViewProps) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const pendingDeleteResume = resumes.find(
    (resume) => resume.id === pendingDeleteId
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppNavbar
        actions={
          <>
            <Button render={<Link href="/" />} variant="secondary">
              Find matching jobs
            </Button>
            <NavAuthActions />
          </>
        }
      />
      <section className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5f9d38]">
            Your library
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            My resumes
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Every resume you have uploaded lives here. Set the one you want to
            use for job matching and analysis as your active resume.
          </p>

          <Card className="mt-6 max-w-2xl rounded-3xl border-dashed p-4 sm:p-5">
            <p className="text-sm font-semibold">Upload a new resume</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Saved right away — no AI analysis runs. It becomes your active
              resume for future matching.
            </p>

            <FileDropzone
              file={selectedFile}
              fileMeta={selectedFile ? formatFileSize(selectedFile.size) : null}
              onFileSelect={onFilePick}
              className="mt-3"
            />

            {uploadErrorMessage ? (
              <Alert variant="destructive" className="mt-3">
                <AlertDescription>{uploadErrorMessage}</AlertDescription>
              </Alert>
            ) : null}

            {selectedFile ? (
              <Button
                type="button"
                onClick={onUploadNew}
                disabled={isUploading}
                className="mt-3 h-11 w-full rounded-full text-sm sm:w-auto"
              >
                {isUploading ? "Uploading..." : "Upload resume"}
              </Button>
            ) : null}
          </Card>

          {errorMessage ? (
            <Alert variant="destructive" className="mt-6 max-w-2xl">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          {isLoading ? (
            <Card className="mt-8 rounded-3xl p-6 text-sm text-muted-foreground">
              Loading your resumes...
            </Card>
          ) : null}

          {!isLoading && status !== "loading" && resumes.length === 0 ? (
            <Card className="mt-8 rounded-3xl border-dashed p-6 text-sm leading-6 text-muted-foreground sm:p-8">
              You have not uploaded a resume yet. Use the box above to upload
              your first one.
            </Card>
          ) : null}

          {resumes.length > 0 ? (
            <div className="mt-8 grid gap-4">
              {resumes.map((resume) => {
                const isActivating = activatingId === resume.id;
                const isDeleting = deletingId === resume.id;
                const isViewing = viewingId === resume.id;
                const isDownloading = downloadingId === resume.id;
                const isBusy = isActivating || isDeleting || isViewing || isDownloading;

                return (
                  <Card
                    key={resume.id}
                    className="flex-row items-center justify-between gap-3 rounded-3xl p-4 sm:p-5"
                  >
                    <div className="min-w-0">
                      <p className="break-all text-base font-semibold tracking-tight sm:text-lg">
                        {resume.fileName ?? "Untitled resume"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Uploaded {formatUploadedAt(resume.createdAt)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {resume.isActive ? (
                        <Badge className="h-8 rounded-full px-4 text-xs">
                          Active
                        </Badge>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => onActivate(resume.id)}
                          disabled={isBusy}
                          variant="outline"
                          className="h-10 rounded-full px-4 text-sm"
                        >
                          {isActivating ? "Setting active..." : "Set active"}
                        </Button>
                      )}
                      {resume.hasFile ? (
                        <>
                          <Button
                            type="button"
                            onClick={() => onView(resume.id)}
                            disabled={isBusy}
                            variant="outline"
                            className="h-10 rounded-full px-4 text-sm"
                          >
                            {isViewing ? "Opening..." : "View"}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => onDownload(resume.id)}
                            disabled={isBusy}
                            variant="outline"
                            className="h-10 rounded-full px-4 text-sm"
                          >
                            {isDownloading ? "Downloading..." : "Download"}
                          </Button>
                        </>
                      ) : null}
                      <Button
                        type="button"
                        onClick={() => onFindJobs(resume.id)}
                        disabled={isBusy}
                        variant="outline"
                        className="h-10 rounded-full px-4 text-sm"
                      >
                        Find Jobs
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setPendingDeleteId(resume.id)}
                        disabled={isBusy}
                        variant="destructive"
                        className="h-10 rounded-full px-4 text-sm"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <AlertDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteResume?.fileName ?? "This resume"} will be
              permanently removed. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (pendingDeleteId) {
                  onDelete(pendingDeleteId);
                }
                setPendingDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};
