import axios from "axios";

export const TOKEN_STORAGE_KEY = "secure_notes_token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function performApiRequest(request) {
  try {
    return await request();
  } catch (error) {
    throw error;
  }
}

export function getStoredToken() {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token) {
  if (token) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    return;
  }

  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}
