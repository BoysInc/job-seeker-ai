import { parseBackendError } from "@/app/api/_lib/backend-error";
import { getBackendBaseUrl } from "@/features/resume-upload/services/backend-config";

type ResetPasswordBody = {
  access_token?: unknown;
  new_password?: unknown;
};

const isResetPasswordBody = (
  body: ResetPasswordBody
): body is Required<ResetPasswordBody> => {
  return (
    typeof body.access_token === "string" &&
    typeof body.new_password === "string"
  );
};

export async function POST(request: Request) {
  const body = (await request.json()) as ResetPasswordBody;

  if (!isResetPasswordBody(body)) {
    return Response.json(
      { message: "A reset token and new password are required." },
      { status: 400 }
    );
  }

  const response = await fetch(`${getBackendBaseUrl()}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_token: body.access_token,
      new_password: body.new_password,
    }),
  });

  if (!response.ok) {
    return Response.json(
      {
        message: await parseBackendError(
          response,
          "Could not reset your password."
        ),
      },
      { status: response.status }
    );
  }

  return Response.json(await response.json());
}
