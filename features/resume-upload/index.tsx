"use client";

import { useResumeUploadController } from "@/features/resume-upload/controllers/use-resume-upload-controller";
import { ResumeUploadView } from "@/features/resume-upload/views/resume-upload.view";

export const ResumeUploadFeature = () => {
  const controller = useResumeUploadController();

  return (
    <ResumeUploadView
      selectedFile={controller.selectedFile}
      selectedFileSizeLabel={controller.selectedFileSizeLabel}
      uploadStatus={controller.uploadStatus}
      errorMessage={controller.errorMessage}
      successMessage={controller.successMessage}
      uploadedResume={controller.uploadedResume}
      isUploading={controller.isUploading}
      onFilePick={controller.pickFile}
      onUpload={controller.handleUpload}
      onReset={controller.reset}
      onFindJobs={controller.handleFindJobs}
    />
  );
};
