"use client";

import { useCallback, useEffect, useRef } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { uploadResume as uploadResumeRequest } from "@/features/resume-upload/services/resume-upload.service";
import { useResumeUploadStore } from "@/features/resume-upload/store/resume-upload.store";

type UploadSession = {
  promise: Promise<{ resumeId: string }>;
};

/** Dedupes upload across Strict Mode remounts for the same file. */
const uploadSessions = new Map<string, UploadSession>();

const getFileKey = (file: File): string =>
  `${file.name}:${file.size}:${file.lastModified}`;

/** Pure "upload a resume" hook: parses + saves the file, nothing else. */
export const useResumeUpload = () => {
  const { accessToken } = useAuth();
  const accessTokenRef = useRef(accessToken);
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  const setUploadStatus = useResumeUploadStore((state) => state.setUploadStatus);
  const setErrorMessage = useResumeUploadStore((state) => state.setErrorMessage);
  const setSuccessMessage = useResumeUploadStore((state) => state.setSuccessMessage);

  const startUpload = useCallback(
    async (file: File): Promise<{ resumeId: string }> => {
      const token = accessTokenRef.current;
      if (!token) {
        const message = "Please sign in before uploading your resume.";
        setUploadStatus("error");
        setErrorMessage(message);
        throw new Error(message);
      }

      const fileKey = getFileKey(file);
      let session = uploadSessions.get(fileKey);

      if (!session) {
        setErrorMessage(null);
        setSuccessMessage(null);
        setUploadStatus("uploading");

        session = {
          promise: uploadResumeRequest(file, token).then((started) => ({
            resumeId: started.resumeId,
          })),
        };
        uploadSessions.set(fileKey, session);
      }

      try {
        return await session.promise;
      } catch (error) {
        setUploadStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "We could not upload your resume right now."
        );
        throw error;
      } finally {
        uploadSessions.delete(fileKey);
      }
    },
    [setErrorMessage, setSuccessMessage, setUploadStatus]
  );

  return { startUpload };
};
