import { getBearerToken, unauthorizedResponse } from "@/app/api/_lib/auth";
import { parseBackendError } from "@/app/api/_lib/backend-error";
import { getBackendBaseUrl } from "@/features/resume-upload/services/backend-config";

export async function GET(request: Request) {
  const accessToken = getBearerToken(request);

  if (!accessToken) {
    return unauthorizedResponse();
  }

  const response = await fetch(`${getBackendBaseUrl()}/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return Response.json(
      { message: await parseBackendError(response, "Session check failed.") },
      { status: response.status }
    );
  }

  return Response.json(await response.json());
}
