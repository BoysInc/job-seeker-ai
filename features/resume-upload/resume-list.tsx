"use client";

import { useResumeListController } from "@/features/resume-upload/controllers/use-resume-list-controller";
import { ResumeListView } from "@/features/resume-upload/views/resume-list.view";

export const ResumeListFeature = () => {
  const controller = useResumeListController();

  return (
    <ResumeListView
      resumes={controller.resumes}
      status={controller.status}
      errorMessage={controller.errorMessage}
      activatingId={controller.activatingId}
      deletingId={controller.deletingId}
      viewingId={controller.viewingId}
      downloadingId={controller.downloadingId}
      selectedFile={controller.selectedFile}
      uploadErrorMessage={controller.uploadErrorMessage}
      isLoading={controller.isLoading}
      isUploading={controller.isUploading}
      onActivate={controller.handleActivate}
      onDelete={controller.handleDelete}
      onFindJobs={controller.handleFindJobs}
      onView={controller.handleView}
      onDownload={controller.handleDownload}
      onFilePick={controller.handleFilePick}
      onUploadNew={controller.handleUploadNew}
    />
  );
};
