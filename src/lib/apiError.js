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
    return "Unable to reach the backend at http://localhost:5000. Make sure the server is running.";
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}
