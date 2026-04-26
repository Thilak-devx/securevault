import { API_BASE_URL } from "./api";

export function getApiErrorMessage(error, fallbackMessage) {
  const validationErrors = error.response?.data?.errors;

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors
      .map((item) => item?.message)
      .filter(Boolean)
      .join(" ");
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ERR_NETWORK") {
    if (!API_BASE_URL) {
      return "Backend URL is not configured. Set VITE_API_BASE_URL in your frontend environment and redeploy.";
    }

    return `Unable to reach the backend at ${API_BASE_URL}. Make sure the server is running and CORS is configured correctly.`;
  }

  if (error.code === "ECONNABORTED") {
    return "The server is taking too long to respond. If you're using a free Render backend, it may be waking up. Please try again in a few seconds.";
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}
