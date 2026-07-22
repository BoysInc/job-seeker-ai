import { create } from "zustand";

import type { ResumeSummary } from "@/features/resume-upload/models/resume-upload.model";

export type ResumeListStatus = "idle" | "loading" | "success" | "error";
export type ResumeUploadStatus = "idle" | "uploading" | "error";

type ResumeListStore = {
  resumes: ResumeSummary[];
  status: ResumeListStatus;
  errorMessage: string | null;
  activatingId: string | null;
  deletingId: string | null;
  viewingId: string | null;
  downloadingId: string | null;
  selectedFile: File | null;
  uploadStatus: ResumeUploadStatus;
  uploadErrorMessage: string | null;
  setResumes: (resumes: ResumeSummary[]) => void;
  setStatus: (status: ResumeListStatus) => void;
  setErrorMessage: (message: string | null) => void;
  setActivatingId: (id: string | null) => void;
  setDeletingId: (id: string | null) => void;
  setViewingId: (id: string | null) => void;
  setDownloadingId: (id: string | null) => void;
  setSelectedFile: (file: File | null) => void;
  setUploadStatus: (status: ResumeUploadStatus) => void;
  setUploadErrorMessage: (message: string | null) => void;
  reset: () => void;
};

export const useResumeListStore = create<ResumeListStore>((set) => ({
  resumes: [],
  status: "idle",
  errorMessage: null,
  activatingId: null,
  deletingId: null,
  viewingId: null,
  downloadingId: null,
  selectedFile: null,
  uploadStatus: "idle",
  uploadErrorMessage: null,
  setResumes: (resumes) => set({ resumes }),
  setStatus: (status) => set({ status }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  setActivatingId: (id) => set({ activatingId: id }),
  setDeletingId: (id) => set({ deletingId: id }),
  setViewingId: (id) => set({ viewingId: id }),
  setDownloadingId: (id) => set({ downloadingId: id }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  setUploadStatus: (status) => set({ uploadStatus: status }),
  setUploadErrorMessage: (message) => set({ uploadErrorMessage: message }),
  reset: () =>
    set({
      resumes: [],
      status: "idle",
      errorMessage: null,
      activatingId: null,
      deletingId: null,
      viewingId: null,
      downloadingId: null,
      selectedFile: null,
      uploadStatus: "idle",
      uploadErrorMessage: null,
    }),
}));
