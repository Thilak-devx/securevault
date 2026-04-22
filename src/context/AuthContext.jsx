import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  googleLoginUser,
  loginUser,
  registerUser,
} from "../lib/authApi";
import {
  api,
  getStoredToken,
  setAuthToken,
  setStoredToken,
} from "../lib/api";
import { isTokenExpired, parseJwt } from "../lib/jwt";

const AuthContext = createContext(null);
const AUTH_ERROR_CODES = new Set([
  "AUTH_TOKEN_MISSING",
  "AUTH_TOKEN_EXPIRED",
  "AUTH_TOKEN_INVALID",
]);

function normalizeAuthResponse(data) {
  const token = data?.token ?? data?.accessToken;
  const user = data?.user ?? parseJwt(token);

  return { token, user };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  function logout(reason = "") {
    setToken(null);
    setUser(null);
    setStoredToken(null);
    setAuthToken(null);

    if (reason) {
      sessionStorage.setItem("secure_notes_auth_message", reason);
    } else {
      sessionStorage.removeItem("secure_notes_auth_message");
    }
  }

  function applySession(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser ?? parseJwt(nextToken));
    setStoredToken(nextToken);
    setAuthToken(nextToken);
    sessionStorage.removeItem("secure_notes_auth_message");
  }

  async function login(credentials) {
    const response = await loginUser(credentials);
    const auth = normalizeAuthResponse(response.data);

    if (!auth.token) {
      throw new Error("No token returned from login.");
    }

    applySession(auth.token, auth.user);
    return auth;
  }

  async function register(payload) {
    const response = await registerUser(payload);
    const auth = normalizeAuthResponse(response.data);

    if (!auth.token) {
      throw new Error("No token returned from registration.");
    }

    applySession(auth.token, auth.user);
    return auth;
  }

  async function googleLogin(credential) {
    const response = await googleLoginUser({ credential });
    const auth = normalizeAuthResponse(response.data);

    if (!auth.token) {
      throw new Error("No token returned from Google login.");
    }

    applySession(auth.token, auth.user);
    return auth;
  }

  useEffect(() => {
    const storedToken = getStoredToken();

    if (storedToken && !isTokenExpired(storedToken)) {
      applySession(storedToken, parseJwt(storedToken));
    } else {
      logout(storedToken ? "Your session expired. Please log in again." : "");
    }

    setIsInitializing(false);
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorCode = error.response?.data?.code;

        if (error.response?.status === 401 && AUTH_ERROR_CODES.has(errorCode)) {
          logout(error.response?.data?.message || "Your session expired. Please log in again.");
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isInitializing,
      login,
      googleLogin,
      register,
      logout,
    }),
    [token, user, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
