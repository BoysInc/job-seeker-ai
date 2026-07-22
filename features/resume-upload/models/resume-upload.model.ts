import type { JobSearchResult } from "@/features/resume-upload/models/job-search.model";

export const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
] as const;

export const ACCEPTED_RESUME_EXTENSIONS = [".pdf"] as const;

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export type RecommendationStatus =
  | "extracting"
  | "searching"
  | "scoring"
  | "complete"
  | "failed";

export type ResumeUploadStarted = {
  resumeId: string;
};

export type FindJobsStarted = {
  resumeId: string;
  fileName: string | null;
  status: RecommendationStatus;
};

export type RecommendationsPoll = {
  status: RecommendationStatus;
  candidateCount: number | null;
  summary: string | null;
  jobs: JobSearchResult[] | null;
  error: string | null;
};

export type ResumeUploadResponse = {
  resumeId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  summary: string;
  jobs: JobSearchResult[];
  message: string;
};

export type ResumeSummary = {
  id: string;
  fileName: string | null;
  createdAt: string;
  isActive: boolean;
  hasFile: boolean;
};

export type ResumeDownload = {
  url: string;
  fileName: string | null;
};

export const isAllowedResumeFileType = (file: File): boolean => {
  if (
    ACCEPTED_RESUME_TYPES.includes(
      file.type as (typeof ACCEPTED_RESUME_TYPES)[number]
    )
  ) {
    return true;
  }

  const fileExtension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  return ACCEPTED_RESUME_EXTENSIONS.includes(
    fileExtension as (typeof ACCEPTED_RESUME_EXTENSIONS)[number]
  );
};

export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
};
