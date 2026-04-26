import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import SecureMascot from "../components/SecureMascot";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { getApiErrorMessage } from "../lib/apiError";

export default function LoginPage() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    const message = sessionStorage.getItem("secure_notes_auth_message");

    if (message) {
      setError(message);
      sessionStorage.removeItem("secure_notes_auth_message");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function warmBackend() {
      try {
        await api.get("/health");
      } catch (warmupError) {
        if (!isMounted) {
          return;
        }
      }
    }

    warmBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Invalid email or password. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    if (!credentialResponse.credential) {
      setError("Google sign-in did not return a credential token.");
      return;
    }

    try {
      setIsGoogleSubmitting(true);
      setError("");
      await googleLogin(credentialResponse.credential);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Google sign-in failed. Please try again."));
    } finally {
      setIsGoogleSubmitting(false);
    }
  }

  function handleGoogleError() {
    setError(
      googleClientId
        ? "Google sign-in could not be completed. Check your Google OAuth authorized JavaScript origins and try again."
        : "Google Sign-In is not configured on the frontend. Set VITE_GOOGLE_CLIENT_ID in Vercel and redeploy.",
    );
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your private workspace and continue managing your secure notes with confidence."
      ctaLabel="Create account"
      ctaTo="/register"
      ctaText="New here?"
      headerVisual={<SecureMascot className="h-44 w-44 xl:h-56 xl:w-56" />}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />
        <div className="flex items-center justify-between pt-1 text-sm">
          <label className="flex items-center gap-2.5 text-sm text-textSecondary">
            <input type="checkbox" className="rounded border-white/20 bg-slate-900" />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm font-medium text-accent transition-all duration-300 hover:text-yellow-300"
          >
            Forgot password?
          </button>
        </div>
        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            <div className="flex items-start gap-3">
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        ) : null}
        <button type="submit" className="block w-full" disabled={isSubmitting}>
          <PrimaryButton
            className={isSubmitting ? "cursor-not-allowed opacity-80" : ""}
          >
            <span className="flex items-center justify-center gap-2.5">
              {isSubmitting ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    className="opacity-25"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    d="M21 12a9 9 0 0 0-9-9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : null}
              <span>{isSubmitting ? "Signing In..." : "Log In"}</span>
            </span>
          </PrimaryButton>
        </button>
        <div className="flex items-center gap-3 pt-1">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-textSecondary">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">
          {isGoogleSubmitting ? (
            <div className="flex h-11 items-center justify-center gap-2 text-sm font-medium text-textPrimary">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 animate-spin"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  className="opacity-25"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Connecting Google account...
            </div>
          ) : (
            <div className="flex min-h-11 items-center justify-center px-4 sm:px-5">
              {googleClientId ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  shape="pill"
                  text="continue_with"
                  width="320"
                />
              ) : (
                <div className="flex w-full items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-center text-sm text-amber-100">
                  Google Sign-In is unavailable until Vercel has a valid <code className="mx-1 rounded bg-black/20 px-1.5 py-0.5 text-xs">VITE_GOOGLE_CLIENT_ID</code>.
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </AuthShell>
  );
}
