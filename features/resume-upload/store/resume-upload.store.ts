import { create } from "zustand";

import {
  DEFAULT_JOB_LOCATION,
  type JobSearchResult,
  type JobSearchStatus,
} from "@/features/resume-upload/models/job-search.model";
import type {
  RecommendationStatus,
  ResumeUploadResponse,
  UploadStatus,
} from "@/features/resume-upload/models/resume-upload.model";

type ResumeUploadStore = {
  selectedFile: File | null;
  uploadStatus: UploadStatus;
  processingPhase: RecommendationStatus | null;
  candidateCount: number | null;
  errorMessage: string | null;
  successMessage: string | null;
  uploadedResume: ResumeUploadResponse | null;
  jobTitle: string;
  jobLocation: string;
  jobSearchStatus: JobSearchStatus;
  jobSearchError: string | null;
  jobs: JobSearchResult[];
  selectedJob: JobSearchResult | null;
  setSelectedFile: (file: File | null) => void;
  setUploadStatus: (status: UploadStatus) => void;
  setProcessingPhase: (phase: RecommendationStatus | null) => void;
  setCandidateCount: (count: number | null) => void;
  setErrorMessage: (message: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  setUploadedResume: (resume: ResumeUploadResponse | null) => void;
  setJobTitle: (title: string) => void;
  setJobLocation: (location: string) => void;
  setJobSearchStatus: (status: JobSearchStatus) => void;
  setJobSearchError: (message: string | null) => void;
  setJobs: (jobs: JobSearchResult[]) => void;
  setSelectedJob: (job: JobSearchResult | null) => void;
  reset: () => void;
};

export const useResumeUploadStore = create<ResumeUploadStore>((set) => ({
  selectedFile: null,
  uploadStatus: "idle",
  processingPhase: null,
  candidateCount: null,
  errorMessage: null,
  successMessage: null,
  uploadedResume: null,
  jobTitle: "",
  jobLocation: DEFAULT_JOB_LOCATION,
  jobSearchStatus: "idle",
  jobSearchError: null,
  jobs: [],
  selectedJob: null,
  setSelectedFile: (file) => set({ selectedFile: file }),
  setUploadStatus: (status) => set({ uploadStatus: status }),
  setProcessingPhase: (phase) => set({ processingPhase: phase }),
  setCandidateCount: (count) => set({ candidateCount: count }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  setSuccessMessage: (message) => set({ successMessage: message }),
  setUploadedResume: (resume) => set({ uploadedResume: resume }),
  setJobTitle: (title) => set({ jobTitle: title }),
  setJobLocation: (location) => set({ jobLocation: location }),
  setJobSearchStatus: (status) => set({ jobSearchStatus: status }),
  setJobSearchError: (message) => set({ jobSearchError: message }),
  setJobs: (jobs) => set({ jobs }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  reset: () =>
    set({
      selectedFile: null,
      uploadStatus: "idle",
      processingPhase: null,
      candidateCount: null,
      errorMessage: null,
      successMessage: null,
      uploadedResume: null,
      jobTitle: "",
      jobLocation: DEFAULT_JOB_LOCATION,
      jobSearchStatus: "idle",
      jobSearchError: null,
      jobs: [],
      selectedJob: null,
    }),
}));
