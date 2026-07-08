"use client";

import { useCallback, useState } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import type {
  ResumeAnalysisResponse,
  ResumeAnalysisStatus,
} from "@/features/resume-upload/models/resume-analysis.model";
import { analyzeResume } from "@/features/resume-upload/services/resume-analysis.service";

export const useResumeAnalysis = () => {
  const { accessToken } = useAuth();
  const [status, setStatus] = useState<ResumeAnalysisStatus>("idle");
  const [result, setResult] = useState<ResumeAnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const analyze = useCallback(
    async (resumeId: string, jobDescription: string) => {
      if (!accessToken) return;

      setStatus("loading");
      setErrorMessage(null);

      try {
        const data = await analyzeResume(
          { resume_id: resumeId, job_description: jobDescription },
          accessToken
        );
        setResult(data);
        setStatus("success");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Resume analysis failed."
        );
        setStatus("error");
      }
    },
    [accessToken]
  );

  return {
    status,
    result,
    errorMessage,
    isLoading: status === "loading",
    analyze,
  };
};
