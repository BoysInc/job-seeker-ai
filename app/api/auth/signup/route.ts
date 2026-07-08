import { parseBackendError } from "@/app/api/_lib/backend-error";
import { getBackendBaseUrl } from "@/features/resume-upload/services/backend-config";

type SignupBody = {
  email?: unknown;
  password?: unknown;
  name?: unknown;
};

const isSignupBody = (body: SignupBody): body is Required<SignupBody> => {
  return (
    typeof body.email === "string" &&
    typeof body.password === "string" &&
    typeof body.name === "string"
  );
};

export async function POST(request: Request) {
  const body = (await request.json()) as SignupBody;

  if (!isSignupBody(body)) {
    return Response.json(
      { message: "Name, email, and password are required." },
      { status: 400 }
    );
  }

  const response = await fetch(`${getBackendBaseUrl()}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
      name: body.name,
    }),
  });

  if (!response.ok) {
    return Response.json(
      { message: await parseBackendError(response, "Signup failed.") },
      { status: response.status }
    );
  }

  return Response.json(await response.json(), { status: 201 });
}
