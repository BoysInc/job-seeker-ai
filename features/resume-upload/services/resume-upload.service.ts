import type { JobSearchResult } from "@/features/resume-upload/models/job-search.model";
import type {
  FindJobsStarted,
  RecommendationStatus,
  RecommendationsPoll,
  ResumeDownload,
  ResumeSummary,
  ResumeUploadStarted,
} from "@/features/resume-upload/models/resume-upload.model";
import { getBackendBaseUrl } from "@/features/resume-upload/services/backend-config";

type BackendUploadResponse = {
  resume_id?: string;
  detail?: string;
  message?: string;
};

type BackendFindJobsResponse = {
  resume_id?: string;
  file_name?: string | null;
  status?: RecommendationStatus;
  detail?: string;
  message?: string;
};

type BackendResumeSummary = {
  id: string;
  file_name: string | null;
  created_at: string;
  is_active: boolean;
  has_file: boolean;
};

type BackendResumeDownloadResponse = {
  url?: string;
  file_name?: string | null;
  detail?: string;
  message?: string;
};

type BackendResumeListResponse = {
  resumes?: BackendResumeSummary[];
  detail?: string;
  message?: string;
};

type BackendRecommendationsResponse = {
  status?: RecommendationStatus;
  candidate_count?: number | null;
  summary?: string | null;
  jobs?: JobSearchResult[] | null;
  error?: string | null;
  detail?: string;
  message?: string;
};

const parseErrorMessage = async (
  response: Response,
  fallback: string
): Promise<string> => {
  try {
    const payload = (await response.json()) as BackendUploadResponse;
    return payload.detail ?? payload.message ?? fallback;
  } catch {
    return fallback;
  }
};

export const uploadResume = async (
  file: File,
  accessToken: string
): Promise<ResumeUploadStarted> => {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const response = await fetch(`${getBackendBaseUrl()}/pdf/upload-resume`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(response, "Resume upload failed. Please try again.")
    );
  }

  const payload = (await response.json()) as BackendUploadResponse;

  if (!payload.resume_id) {
    throw new Error("Backend response did not include the resume id.");
  }

  return {
    resumeId: payload.resume_id,
  };
};

export const findJobs = async (
  accessToken: string,
  resumeId?: string
): Promise<FindJobsStarted> => {
  const response = await fetch(`${getBackendBaseUrl()}/pdf/find-jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ resume_id: resumeId ?? null }),
  });

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(response, "Could not start job matching. Please try again.")
    );
  }

  const payload = (await response.json()) as BackendFindJobsResponse;

  if (!payload.resume_id || !payload.status) {
    throw new Error("Backend response did not include the matching status.");
  }

  return {
    resumeId: payload.resume_id,
    fileName: payload.file_name ?? null,
    status: payload.status,
  };
};

export const getJobRecommendations = async (
  resumeId: string,
  accessToken: string
): Promise<RecommendationsPoll> => {
  const response = await fetch(
    `${getBackendBaseUrl()}/pdf/resume/${resumeId}/recommendations`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(
        response,
        "Could not check the job matching status. Please try again."
      )
    );
  }

  const payload = (await response.json()) as BackendRecommendationsResponse;

  if (!payload.status) {
    throw new Error("Backend response did not include the matching status.");
  }

  return {
    status: payload.status,
    candidateCount: payload.candidate_count ?? null,
    summary: payload.summary ?? null,
    jobs: payload.jobs ?? null,
    error: payload.error ?? null,
  };
};

const toResumeSummary = (resume: BackendResumeSummary): ResumeSummary => ({
  id: resume.id,
  fileName: resume.file_name,
  createdAt: resume.created_at,
  isActive: resume.is_active,
  hasFile: resume.has_file,
});

export const listResumes = async (accessToken: string): Promise<ResumeSummary[]> => {
  const response = await fetch(`${getBackendBaseUrl()}/pdf/resumes`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(response, "Could not load your resumes. Please try again.")
    );
  }

  const payload = (await response.json()) as BackendResumeListResponse;
  return (payload.resumes ?? []).map(toResumeSummary);
};

export const activateResume = async (
  resumeId: string,
  accessToken: string
): Promise<ResumeSummary> => {
  const response = await fetch(
    `${getBackendBaseUrl()}/pdf/resume/${resumeId}/activate`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(response, "Could not set this resume as active. Please try again.")
    );
  }

  const payload = (await response.json()) as BackendResumeSummary;
  return toResumeSummary(payload);
};

export const deleteResume = async (
  resumeId: string,
  accessToken: string
): Promise<void> => {
  const response = await fetch(`${getBackendBaseUrl()}/pdf/resume/${resumeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(response, "Could not delete this resume. Please try again.")
    );
  }
};

export const getResumeDownloadUrl = async (
  resumeId: string,
  accessToken: string
): Promise<ResumeDownload> => {
  const response = await fetch(
    `${getBackendBaseUrl()}/pdf/resume/${resumeId}/download`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(
        response,
        "Could not open this resume. Please try again."
      )
    );
  }

  const payload = (await response.json()) as BackendResumeDownloadResponse;

  if (!payload.url) {
    throw new Error("Backend response did not include a download URL.");
  }

  return {
    url: payload.url,
    fileName: payload.file_name ?? null,
  };
};
