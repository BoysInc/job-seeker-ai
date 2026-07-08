"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useFindJobsNavigation } from "@/features/resume-upload/hooks/use-find-jobs-navigation";
import {
  DEFAULT_JOB_SEARCH_LIMIT,
  type JobSearchResult,
} from "@/features/resume-upload/models/job-search.model";
import {
  ACCEPTED_RESUME_EXTENSIONS,
  ACCEPTED_RESUME_TYPES,
  MAX_RESUME_SIZE_BYTES,
  formatFileSize,
} from "@/features/resume-upload/models/resume-upload.model";
import { searchJobs } from "@/features/resume-upload/services/job-search.service";
import { useResumeUploadStore } from "@/features/resume-upload/store/resume-upload.store";

const isAllowedFileType = (file: File): boolean => {
  if (ACCEPTED_RESUME_TYPES.includes(file.type as (typeof ACCEPTED_RESUME_TYPES)[number])) {
    return true;
  }

  const fileExtension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  return ACCEPTED_RESUME_EXTENSIONS.includes(
    fileExtension as (typeof ACCEPTED_RESUME_EXTENSIONS)[number]
  );
};

export const useResumeUploadController = () => {
  const router = useRouter();
  const { accessToken, isAuthenticated } = useAuth();
  const { goFindJobs } = useFindJobsNavigation();
  const selectedFile = useResumeUploadStore((state) => state.selectedFile);
  const uploadStatus = useResumeUploadStore((state) => state.uploadStatus);
  const errorMessage = useResumeUploadStore((state) => state.errorMessage);
  const successMessage = useResumeUploadStore((state) => state.successMessage);
  const uploadedResume = useResumeUploadStore((state) => state.uploadedResume);
  const jobTitle = useResumeUploadStore((state) => state.jobTitle);
  const jobLocation = useResumeUploadStore((state) => state.jobLocation);
  const jobSearchStatus = useResumeUploadStore(
    (state) => state.jobSearchStatus
  );
  const jobSearchError = useResumeUploadStore((state) => state.jobSearchError);
  const jobs = useResumeUploadStore((state) => state.jobs);
  const selectedJob = useResumeUploadStore((state) => state.selectedJob);

  const setSelectedFile = useResumeUploadStore((state) => state.setSelectedFile);
  const setUploadStatus = useResumeUploadStore((state) => state.setUploadStatus);
  const setErrorMessage = useResumeUploadStore((state) => state.setErrorMessage);
  const setSuccessMessage = useResumeUploadStore(
    (state) => state.setSuccessMessage
  );
  const setUploadedResume = useResumeUploadStore(
    (state) => state.setUploadedResume
  );
  const setJobTitle = useResumeUploadStore((state) => state.setJobTitle);
  const setJobLocation = useResumeUploadStore((state) => state.setJobLocation);
  const setJobSearchStatus = useResumeUploadStore(
    (state) => state.setJobSearchStatus
  );
  const setJobSearchError = useResumeUploadStore(
    (state) => state.setJobSearchError
  );
  const setJobs = useResumeUploadStore((state) => state.setJobs);
  const setSelectedJob = useResumeUploadStore((state) => state.setSelectedJob);
  const reset = useResumeUploadStore((state) => state.reset);

  const selectedFileSizeLabel = useMemo(
    () => (selectedFile ? formatFileSize(selectedFile.size) : null),
    [selectedFile]
  );

  const pickFile = useCallback(
    (file: File | null) => {
      setErrorMessage(null);
      setSuccessMessage(null);
      setUploadedResume(null);
      setJobs([]);
      setSelectedJob(null);
      setJobSearchError(null);
      setJobSearchStatus("idle");

      if (!file) {
        setSelectedFile(null);
        setUploadStatus("idle");
        return;
      }

      if (!isAllowedFileType(file)) {
        setSelectedFile(null);
        setUploadStatus("error");
        setErrorMessage("Only PDF files are allowed.");
        return;
      }

      if (file.size > MAX_RESUME_SIZE_BYTES) {
        setSelectedFile(null);
        setUploadStatus("error");
        setErrorMessage("File is too large. Please upload a file up to 5 MB.");
        return;
      }

      setSelectedFile(file);
      setUploadStatus("idle");
    },
    [
      setErrorMessage,
      setJobSearchError,
      setJobSearchStatus,
      setJobs,
      setSelectedFile,
      setSelectedJob,
      setSuccessMessage,
      setUploadStatus,
      setUploadedResume,
    ]
  );

  const handleUpload = useCallback(async () => {
    if (!isAuthenticated) {
      setErrorMessage("Please sign in before uploading your resume.");
      setUploadStatus("error");
      router.push("/login");
      return;
    }

    if (!selectedFile) {
      setErrorMessage("Please choose your resume before continuing.");
      setUploadStatus("error");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadedResume(null);
    setUploadStatus("uploading");
    setJobs([]);
    setSelectedJob(null);
    setJobSearchError(null);
    setJobSearchStatus("idle");
    router.push("/processing");
  }, [
    isAuthenticated,
    selectedFile,
    router,
    setErrorMessage,
    setJobSearchError,
    setJobSearchStatus,
    setJobs,
    setSelectedJob,
    setSuccessMessage,
    setUploadStatus,
    setUploadedResume,
  ]);

  const handleJobTitleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setJobTitle(event.target.value);
    },
    [setJobTitle]
  );

  const handleJobLocationChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setJobLocation(event.target.value);
    },
    [setJobLocation]
  );

  const handleJobSearchSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!uploadedResume) {
        setJobSearchError("Upload your resume before searching for jobs.");
        return;
      }

      if (!accessToken) {
        setJobSearchError("Please sign in before searching for jobs.");
        setJobSearchStatus("error");
        router.push("/login");
        return;
      }

      const trimmedTitle = jobTitle.trim();

      if (!trimmedTitle) {
        setJobSearchError("Enter a job title to search.");
        setJobSearchStatus("error");
        return;
      }

      setJobSearchError(null);
      setJobSearchStatus("searching");
      setSelectedJob(null);

      try {
        const response = await searchJobs({
          title: trimmedTitle,
          location: jobLocation.trim() || "UAE",
          limit: DEFAULT_JOB_SEARCH_LIMIT,
        }, accessToken);

        setJobs(response.jobs);
        setJobSearchStatus("success");
      } catch (error) {
        setJobs([]);
        setJobSearchStatus("error");
        setJobSearchError(
          error instanceof Error
            ? error.message
            : "Could not search jobs right now."
        );
      }
    },
    [
      accessToken,
      jobLocation,
      jobTitle,
      router,
      setJobSearchError,
      setJobSearchStatus,
      setJobs,
      setSelectedJob,
      uploadedResume,
    ]
  );

  const handleSelectJob = useCallback(
    (job: JobSearchResult) => {
      setSelectedJob(job);
    },
    [setSelectedJob]
  );

  const handleFindJobs = useCallback(() => {
    if (!isAuthenticated) {
      setErrorMessage("Please sign in before finding matching jobs.");
      router.push("/login");
      return;
    }

    goFindJobs();
  }, [goFindJobs, isAuthenticated, router, setErrorMessage]);

  return {
    selectedFile,
    selectedFileSizeLabel,
    uploadStatus,
    errorMessage,
    successMessage,
    uploadedResume,
    jobTitle,
    jobLocation,
    jobSearchStatus,
    jobSearchError,
    jobs,
    selectedJob,
    isUploading: uploadStatus === "uploading",
    isSearchingJobs: jobSearchStatus === "searching",
    pickFile,
    handleUpload,
    handleJobTitleChange,
    handleJobLocationChange,
    handleJobSearchSubmit,
    handleSelectJob,
    handleFindJobs,
    reset,
  };
};
