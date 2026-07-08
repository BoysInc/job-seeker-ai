import type {
  JobSearchRequest,
  JobSearchResponse,
} from "@/features/resume-upload/models/job-search.model";
import { getBackendBaseUrl } from "@/features/resume-upload/services/backend-config";

type BackendErrorResponse = {
  message?: string;
  detail?: string;
};

const parseBackendError = async (response: Response): Promise<string> => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as BackendErrorResponse;
    return payload.message ?? payload.detail ?? "Job search failed.";
  }

  const message = await response.text();
  return message || "Job search failed.";
};

export const searchJobsFromBackend = async (
  request: JobSearchRequest,
  accessToken: string
): Promise<JobSearchResponse> => {
  console.log("searchJobsFromBackend", request);
  const response = await fetch(`${getBackendBaseUrl()}/jobs/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await parseBackendError(response));
  }

  return (await response.json()) as JobSearchResponse;
};
