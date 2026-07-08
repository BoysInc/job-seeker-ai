"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/** Navigates to the standalone "find jobs" flow on /processing, which then
 * lands on /jobs once matching completes. Omit `resumeId` to match against
 * the user's active resume (resolved server-side). */
export const useFindJobsNavigation = () => {
  const router = useRouter();

  const goFindJobs = useCallback(
    (resumeId?: string) => {
      const params = new URLSearchParams({ mode: "find-jobs" });
      if (resumeId) {
        params.set("resumeId", resumeId);
      }
      router.push(`/processing?${params.toString()}`);
    },
    [router]
  );

  return { goFindJobs };
};
