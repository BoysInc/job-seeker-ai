"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useResumeUploadController } from "@/features/resume-upload/controllers/use-resume-upload-controller";
import { JobSearchView } from "@/features/resume-upload/views/job-search.view";

export const JobSearchFeature = () => {
  useAuth();
  const controller = useResumeUploadController();

  return (
    <JobSearchView
      uploadedResume={controller.uploadedResume}
      jobs={controller.jobs}
      onFindJobs={controller.handleFindJobs}
    />
  );
};
