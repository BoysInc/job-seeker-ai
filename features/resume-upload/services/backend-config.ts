const DEFAULT_BACKEND_BASE_URL = "http://localhost:8000";

export const getBackendBaseUrl = () => {
  // NEXT_PUBLIC_BACKEND_BASE_URL is inlined into the client bundle at build
  // time and must stay a static process.env reference. BACKEND_BASE_URL is
  // only defined in the Node.js environment (API route handlers).
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL?.trim() ||
    process.env.BACKEND_BASE_URL?.trim() ||
    DEFAULT_BACKEND_BASE_URL;

  const baseUrlWithProtocol = /^https?:\/\//i.test(rawBaseUrl)
    ? rawBaseUrl
    : `http://${rawBaseUrl}`;

  return baseUrlWithProtocol.replace(/\/+$/, "");
};
