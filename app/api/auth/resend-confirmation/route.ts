import { parseBackendError } from "@/app/api/_lib/backend-error";
import { getBackendBaseUrl } from "@/features/resume-upload/services/backend-config";

type ResendConfirmationBody = {
  email?: unknown;
};

const isResendConfirmationBody = (
  body: ResendConfirmationBody
): body is Required<ResendConfirmationBody> => {
  return typeof body.email === "string";
};

export async function POST(request: Request) {
  const body = (await request.json()) as ResendConfirmationBody;

  if (!isResendConfirmationBody(body)) {
    return Response.json({ message: "Email is required." }, { status: 400 });
  }

  const response = await fetch(`${getBackendBaseUrl()}/auth/resend-confirmation`, {
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
          "Could not resend the confirmation email."
        ),
      },
      { status: response.status }
    );
  }

  return Response.json(await response.json());
}
