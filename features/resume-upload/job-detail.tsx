"use client";

import { useCallback } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useResumeAnalysis } from "@/features/resume-upload/hooks/use-resume-analysis";
import { useResumeUploadStore } from "@/features/resume-upload/store/resume-upload.store";
import { JobDetailView } from "@/features/resume-upload/views/job-detail.view";

type JobDetailFeatureProps = {
  jobId: string;
};

export const JobDetailFeature = ({ jobId }: JobDetailFeatureProps) => {
  useAuth();
  const jobs = useResumeUploadStore((state) => state.jobs);
  const uploadedResume = useResumeUploadStore((state) => state.uploadedResume);
  const job = jobs.find((j) => j.job_id === jobId) ?? null;

  const analysis = useResumeAnalysis();

  const handleAnalyze = useCallback(() => {
    if (!uploadedResume?.resumeId || !job?.description) return;
    void analysis.analyze(uploadedResume.resumeId, job.description);
  }, [analysis, job, uploadedResume]);

  return (
    <JobDetailView
      job={job}
      resumeId={uploadedResume?.resumeId ?? null}
      analysisStatus={analysis.status}
      analysisResult={analysis.result}
      analysisError={analysis.errorMessage}
      onAnalyze={handleAnalyze}
    />
  );
};
