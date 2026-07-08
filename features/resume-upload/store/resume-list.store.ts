import { create } from "zustand";

import type { ResumeSummary } from "@/features/resume-upload/models/resume-upload.model";

export type ResumeListStatus = "idle" | "loading" | "success" | "error";

type ResumeListStore = {
  resumes: ResumeSummary[];
  status: ResumeListStatus;
  errorMessage: string | null;
  activatingId: string | null;
  deletingId: string | null;
  setResumes: (resumes: ResumeSummary[]) => void;
  setStatus: (status: ResumeListStatus) => void;
  setErrorMessage: (message: string | null) => void;
  setActivatingId: (id: string | null) => void;
  setDeletingId: (id: string | null) => void;
  reset: () => void;
};

export const useResumeListStore = create<ResumeListStore>((set) => ({
  resumes: [],
  status: "idle",
  errorMessage: null,
  activatingId: null,
  deletingId: null,
  setResumes: (resumes) => set({ resumes }),
  setStatus: (status) => set({ status }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  setActivatingId: (id) => set({ activatingId: id }),
  setDeletingId: (id) => set({ deletingId: id }),
  reset: () =>
    set({
      resumes: [],
      status: "idle",
      errorMessage: null,
      activatingId: null,
      deletingId: null,
    }),
}));
