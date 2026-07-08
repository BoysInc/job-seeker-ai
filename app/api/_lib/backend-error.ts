type BackendErrorResponse = {
  message?: string;
  detail?: string;
};

export const parseBackendError = async (
  response: Response,
  fallbackMessage: string
): Promise<string> => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as BackendErrorResponse;
    return payload.message ?? payload.detail ?? fallbackMessage;
  }

  const message = await response.text();
  return message || fallbackMessage;
};
