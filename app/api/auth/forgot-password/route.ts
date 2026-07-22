import { parseBackendError } from "@/app/api/_lib/backend-error";
import { getBackendBaseUrl } from "@/features/resume-upload/services/backend-config";

type ForgotPasswordBody = {
  email?: unknown;
};

const isForgotPasswordBody = (
  body: ForgotPasswordBody
): body is Required<ForgotPasswordBody> => {
  return typeof body.email === "string";
};

export async function POST(request: Request) {
  const body = (await request.json()) as ForgotPasswordBody;

  if (!isForgotPasswordBody(body)) {
    return Response.json({ message: "Email is required." }, { status: 400 });
  }

  const response = await fetch(`${getBackendBaseUrl()}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email: body.email }),
  });

  if (!response.ok) {
    return Response.json(
      {
        message: await parseBackendError(
          response,
          "Could not request a password reset."
        ),
      },
      { status: response.status }
    );
  }

  return Response.json(await response.json());
}
