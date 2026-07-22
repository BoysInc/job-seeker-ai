"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useFindJobsNavigation } from "@/features/resume-upload/hooks/use-find-jobs-navigation";
import {
  MAX_RESUME_SIZE_BYTES,
  isAllowedResumeFileType,
} from "@/features/resume-upload/models/resume-upload.model";
import {
  activateResume,
  deleteResume,
  getResumeDownloadUrl,
  listResumes,
  uploadResume,
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
  const viewingId = useResumeListStore((state) => state.viewingId);
  const downloadingId = useResumeListStore((state) => state.downloadingId);
  const selectedFile = useResumeListStore((state) => state.selectedFile);
  const uploadStatus = useResumeListStore((state) => state.uploadStatus);
  const uploadErrorMessage = useResumeListStore(
    (state) => state.uploadErrorMessage
  );
  const setResumes = useResumeListStore((state) => state.setResumes);
  const setStatus = useResumeListStore((state) => state.setStatus);
  const setErrorMessage = useResumeListStore((state) => state.setErrorMessage);
  const setActivatingId = useResumeListStore((state) => state.setActivatingId);
  const setDeletingId = useResumeListStore((state) => state.setDeletingId);
  const setViewingId = useResumeListStore((state) => state.setViewingId);
  const setDownloadingId = useResumeListStore((state) => state.setDownloadingId);
  const setSelectedFile = useResumeListStore((state) => state.setSelectedFile);
  const setUploadStatus = useResumeListStore((state) => state.setUploadStatus);
  const setUploadErrorMessage = useResumeListStore(
    (state) => state.setUploadErrorMessage
  );

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

  const handleFilePick = useCallback(
    (file: File | null) => {
      setUploadErrorMessage(null);

      if (!file) {
        setSelectedFile(null);
        return;
      }

      if (!isAllowedResumeFileType(file)) {
        setSelectedFile(null);
        setUploadErrorMessage("Only PDF files are allowed.");
        return;
      }

      if (file.size > MAX_RESUME_SIZE_BYTES) {
        setSelectedFile(null);
        setUploadErrorMessage("File is too large. Please upload a file up to 5 MB.");
        return;
      }

      setSelectedFile(file);
    },
    [setSelectedFile, setUploadErrorMessage]
  );

  const handleUploadNew = useCallback(async () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }

    if (!selectedFile) {
      setUploadErrorMessage("Choose a resume to upload.");
      return;
    }

    setUploadStatus("uploading");
    setUploadErrorMessage(null);

    try {
      // Just save + parse the file — no job matching/analysis. Users come
      // here to manage resumes, not to run the AI flow (that lives on "/").
      await uploadResume(selectedFile, accessToken);
      setSelectedFile(null);
      setUploadStatus("idle");
      await fetchResumes();
    } catch (error) {
      setUploadStatus("error");
      setUploadErrorMessage(
        error instanceof Error ? error.message : "Could not upload this resume."
      );
    }
  }, [
    accessToken,
    fetchResumes,
    router,
    selectedFile,
    setSelectedFile,
    setUploadErrorMessage,
    setUploadStatus,
  ]);

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

  const handleView = useCallback(
    async (resumeId: string) => {
      if (!accessToken) {
        router.push("/login");
        return;
      }

      setViewingId(resumeId);
      setErrorMessage(null);

      // Open the tab synchronously (before the await) so browser popup
      // blockers still treat this as a direct result of the user's click.
      const newTab = window.open("", "_blank");

      try {
        const { url } = await getResumeDownloadUrl(resumeId, accessToken);
        if (newTab) {
          newTab.location.href = url;
        } else {
          window.open(url, "_blank");
        }
      } catch (error) {
        newTab?.close();
        setErrorMessage(
          error instanceof Error ? error.message : "Could not open this resume."
        );
      } finally {
        setViewingId(null);
      }
    },
    [accessToken, router, setErrorMessage, setViewingId]
  );

  const handleDownload = useCallback(
    async (resumeId: string) => {
      if (!accessToken) {
        router.push("/login");
        return;
      }

      setDownloadingId(resumeId);
      setErrorMessage(null);

      try {
        const { url, fileName } = await getResumeDownloadUrl(resumeId, accessToken);
        const fileResponse = await fetch(url);
        if (!fileResponse.ok) {
          throw new Error("Could not download this resume.");
        }

        const blob = await fileResponse.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = fileName ?? "resume.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(objectUrl);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Could not download this resume."
        );
      } finally {
        setDownloadingId(null);
      }
    },
    [accessToken, router, setErrorMessage, setDownloadingId]
  );

  return {
    resumes,
    status,
    errorMessage,
    activatingId,
    deletingId,
    viewingId,
    downloadingId,
    selectedFile,
    uploadStatus,
    uploadErrorMessage,
    isLoading: status === "loading",
    isUploading: uploadStatus === "uploading",
    handleActivate,
    handleDelete,
    handleView,
    handleDownload,
    handleFindJobs,
    handleFilePick,
    handleUploadNew,
  };
};
