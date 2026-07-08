"use client";

import { useResumeProcessing } from "@/features/resume-upload/hooks/use-resume-processing";
import { useResumeUploadStore } from "@/features/resume-upload/store/resume-upload.store";
import { ResumeProcessingView } from "@/features/resume-upload/views/resume-processing.view";

export const ResumeProcessingFeature = () => {
  useResumeProcessing();

  const processingPhase = useResumeUploadStore(
    (state) => state.processingPhase,
  );
  const candidateCount = useResumeUploadStore((state) => state.candidateCount);

  return (
    <ResumeProcessingView
      processingPhase={processingPhase}
      candidateCount={candidateCount}
    />
  );
};
