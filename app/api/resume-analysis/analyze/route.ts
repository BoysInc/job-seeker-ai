import { getBearerToken, unauthorizedResponse } from "@/app/api/_lib/auth";
import { parseBackendError } from "@/app/api/_lib/backend-error";
import { getBackendBaseUrl } from "@/features/resume-upload/services/backend-config";

type AnalyzeBody = {
  resume_id?: unknown;
  job_description?: unknown;
};

export async function POST(request: Request) {
  const accessToken = getBearerToken(request);

  if (!accessToken) {
    return unauthorizedResponse();
  }

  const body = (await request.json()) as AnalyzeBody;

  if (
    typeof body.resume_id !== "string" ||
    typeof body.job_description !== "string"
  ) {
    return Response.json(
      { message: "resume_id and job_description are required." },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${getBackendBaseUrl()}/resume-analysis/analyze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        resume_id: body.resume_id,
        job_description: body.job_description,
      }),
    }
  );

  if (!response.ok) {
    return Response.json(
      { message: await parseBackendError(response, "Resume analysis failed.") },
      { status: response.status }
    );
  }

  return Response.json(await response.json());
}
