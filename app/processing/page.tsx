import { Suspense } from "react";

import { ResumeProcessingFeature } from "@/features/resume-upload/processing";

export default function ProcessingPage() {
  return (
    <Suspense fallback={null}>
      <ResumeProcessingFeature />
    </Suspense>
  );
}
