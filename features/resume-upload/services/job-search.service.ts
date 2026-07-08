import type {
  JobSearchRequest,
  JobSearchResponse,
} from "@/features/resume-upload/models/job-search.model";

type JobSearchErrorResponse = {
  message?: string;
};

export const searchJobs = async (
  request: JobSearchRequest,
  accessToken: string
): Promise<JobSearchResponse> => {
  const response = await fetch("/api/jobs/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorPayload = (await response.json()) as JobSearchErrorResponse;
    throw new Error(errorPayload.message ?? "Job search failed.");
  }

  return (await response.json()) as JobSearchResponse;
};
