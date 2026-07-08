import { parseBackendError } from "@/app/api/_lib/backend-error";
import { getBackendBaseUrl } from "@/features/resume-upload/services/backend-config";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

const isLoginBody = (body: LoginBody): body is Required<LoginBody> => {
  return typeof body.email === "string" && typeof body.password === "string";
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;

  if (!isLoginBody(body)) {
    return Response.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  const response = await fetch(`${getBackendBaseUrl()}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
  });

  if (!response.ok) {
    return Response.json(
      { message: await parseBackendError(response, "Login failed.") },
      { status: response.status }
    );
  }

  return Response.json(await response.json());
}
