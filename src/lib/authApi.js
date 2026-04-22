import { api, performApiRequest } from "./api";

export async function registerUser(payload) {
  return performApiRequest(() => api.post("/register", payload));
}

export async function loginUser(payload) {
  return performApiRequest(() => api.post("/login", payload));
}

export async function googleLoginUser(payload) {
  return performApiRequest(() => api.post("/google-login", payload));
}

export async function forgotPasswordRequest(payload) {
  return performApiRequest(() => api.post("/forgot-password", payload));
}

export async function resetPasswordRequest(token, payload) {
  return performApiRequest(() => api.post(`/reset-password/${token}`, payload));
}
