const BEARER_PREFIX = "Bearer ";

export const getBearerToken = (request: Request): string | null => {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith(BEARER_PREFIX)) {
    return null;
  }

  const token = authorization.slice(BEARER_PREFIX.length).trim();
  return token || null;
};

export const unauthorizedResponse = () => {
  return Response.json(
    { message: "You must be authenticated to use this API." },
    { status: 401 }
  );
};
