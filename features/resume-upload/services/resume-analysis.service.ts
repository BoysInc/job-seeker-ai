import type {
  ResumeAnalysisRequest,
  ResumeAnalysisResponse,
} from "@/features/resume-upload/models/resume-analysis.model";

type AnalysisErrorResponse = {
  message?: string;
};

export const analyzeResume = async (
  request: ResumeAnalysisRequest,
  accessToken: string
): Promise<ResumeAnalysisResponse> => {
  const response = await fetch("/api/resume-analysis/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const payload = (await response.json()) as AnalysisErrorResponse;
    throw new Error(payload.message ?? "Resume analysis failed.");
  }

  return (await response.json()) as ResumeAnalysisResponse;
};
