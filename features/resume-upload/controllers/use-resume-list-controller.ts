"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useFindJobsNavigation } from "@/features/resume-upload/hooks/use-find-jobs-navigation";
import {
  activateResume,
  deleteResume,
  listResumes,
} from "@/features/resume-upload/services/resume-upload.service";
import { useResumeListStore } from "@/features/resume-upload/store/resume-list.store";

export const useResumeListController = () => {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { goFindJobs } = useFindJobsNavigation();

  const resumes = useResumeListStore((state) => state.resumes);
  const status = useResumeListStore((state) => state.status);
  const errorMessage = useResumeListStore((state) => state.errorMessage);
  const activatingId = useResumeListStore((state) => state.activatingId);
  const deletingId = useResumeListStore((state) => state.deletingId);
  const setResumes = useResumeListStore((state) => state.setResumes);
  const setStatus = useResumeListStore((state) => state.setStatus);
  const setErrorMessage = useResumeListStore((state) => state.setErrorMessage);
  const setActivatingId = useResumeListStore((state) => state.setActivatingId);
  const setDeletingId = useResumeListStore((state) => state.setDeletingId);

  const fetchResumes = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      const nextResumes = await listResumes(accessToken);
      setResumes(nextResumes);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Could not load your resumes."
      );
    }
  }, [accessToken, setErrorMessage, setResumes, setStatus]);

  useEffect(() => {
    if (!accessToken) return;
    fetchResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleActivate = useCallback(
    async (resumeId: string) => {
      if (!accessToken) {
        router.push("/login");
        return;
      }

      setActivatingId(resumeId);
      setErrorMessage(null);

      try {
        await activateResume(resumeId, accessToken);
        setResumes(
          resumes.map((resume) => ({
            ...resume,
            isActive: resume.id === resumeId,
          }))
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Could not set this resume as active."
        );
      } finally {
        setActivatingId(null);
      }
    },
    [accessToken, resumes, router, setActivatingId, setErrorMessage, setResumes]
  );

  const handleDelete = useCallback(
    async (resumeId: string) => {
      if (!accessToken) {
        router.push("/login");
        return;
      }

      setDeletingId(resumeId);
      setErrorMessage(null);

      try {
        await deleteResume(resumeId, accessToken);
        setResumes(resumes.filter((resume) => resume.id !== resumeId));
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Could not delete this resume."
        );
      } finally {
        setDeletingId(null);
      }
    },
    [accessToken, resumes, router, setDeletingId, setErrorMessage, setResumes]
  );

  const handleFindJobs = useCallback(
    (resumeId: string) => {
      if (!accessToken) {
        router.push("/login");
        return;
      }

      goFindJobs(resumeId);
    },
    [accessToken, goFindJobs, router]
  );

  return {
    resumes,
    status,
    errorMessage,
    activatingId,
    deletingId,
    isLoading: status === "loading",
    handleActivate,
    handleDelete,
    handleFindJobs,
  };
};
