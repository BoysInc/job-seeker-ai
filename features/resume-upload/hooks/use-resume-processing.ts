"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useJobMatching } from "@/features/resume-upload/hooks/use-job-matching";
import { useResumeUpload } from "@/features/resume-upload/hooks/use-resume-upload";
import { useResumeUploadStore } from "@/features/resume-upload/store/resume-upload.store";

/**
 * Combined controller for the /processing page: chains the pure upload and
 * job-matching hooks. With no `mode` param it uploads `selectedFile` then
 * matches it (today's home-page flow). With `mode=find-jobs` it skips
 * uploading and matches an existing resume (`resumeId` param, or the
 * backend's active resume if omitted) — the standalone "Find Jobs" flow.
 */
export const useResumeProcessing = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useAuth();
  const { startUpload } = useResumeUpload();
  const { startMatching } = useJobMatching();

  const selectedFile = useResumeUploadStore((state) => state.selectedFile);
  const selectedFileRef = useRef(selectedFile);
  useEffect(() => {
    selectedFileRef.current = selectedFile;
  }, [selectedFile]);

  const setUploadStatus = useResumeUploadStore((state) => state.setUploadStatus);
  const setErrorMessage = useResumeUploadStore((state) => state.setErrorMessage);
  const setSuccessMessage = useResumeUploadStore((state) => state.setSuccessMessage);
  const setUploadedResume = useResumeUploadStore((state) => state.setUploadedResume);

  const isStandalone = searchParams.get("mode") === "find-jobs";
  const resumeIdParam = searchParams.get("resumeId");

  useEffect(() => {
    if (!isStandalone && !selectedFile) {
      setErrorMessage("Please choose your resume before continuing.");
      setUploadStatus("error");
      router.replace("/");
      return;
    }

    if (!accessToken) {
      return;
    }

    let cancelled = false;
    let stopMatching: (() => void) | null = null;

    const fail = (message: string) => {
      if (cancelled) return;
      setUploadStatus("error");
      setErrorMessage(message);
      router.replace("/");
    };

    if (isStandalone) {
      stopMatching = startMatching({
        resumeId: resumeIdParam ?? undefined,
        onComplete: (poll, resumeId, fileName) => {
          if (cancelled) return;
          setUploadStatus("success");
          setSuccessMessage("Found matching jobs.");
          setUploadedResume({
            resumeId,
            fileName: fileName ?? "Your resume",
            fileSize: 0,
            uploadedAt: new Date().toISOString(),
            summary: poll.summary ?? "",
            jobs: poll.jobs ?? [],
            message: "Found matching jobs.",
          });
          router.replace("/jobs");
        },
        onFail: fail,
      });
    } else {
      const file = selectedFileRef.current!;
      void (async () => {
        try {
          const { resumeId } = await startUpload(file);
          if (cancelled) return;

          stopMatching = startMatching({
            resumeId,
            onComplete: (poll, matchedResumeId) => {
              if (cancelled) return;
              const currentFile = selectedFileRef.current;
              setUploadStatus("success");
              setSuccessMessage("Resume analyzed successfully.");
              setUploadedResume({
                resumeId: matchedResumeId,
                fileName: currentFile?.name ?? "Your resume",
                fileSize: currentFile?.size ?? 0,
                uploadedAt: new Date().toISOString(),
                summary: poll.summary ?? "",
                jobs: poll.jobs ?? [],
                message: "Resume analyzed successfully.",
              });
              router.replace("/jobs");
            },
            onFail: fail,
          });
        } catch (error) {
          fail(
            error instanceof Error
              ? error.message
              : "We could not analyze your resume right now."
          );
        }
      })();
    }

    return () => {
      cancelled = true;
      stopMatching?.();
    };
  }, [
    accessToken,
    isStandalone,
    resumeIdParam,
    router,
    selectedFile,
    setErrorMessage,
    setSuccessMessage,
    setUploadStatus,
    setUploadedResume,
    startMatching,
    startUpload,
  ]);
};
