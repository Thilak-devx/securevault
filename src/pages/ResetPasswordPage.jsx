import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { resetPasswordRequest } from "../lib/authApi";
import { getApiErrorMessage } from "../lib/apiError";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Reset token is missing from the URL.");
    }
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const response = await resetPasswordRequest(token, { password });
      setSuccess(response.data?.message || "Password reset successful.");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1800);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "We couldn't reset your password. Please request a new reset link.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="Choose a new password for your secure notes account."
      ctaLabel="Back to login"
      ctaTo="/login"
      ctaText="Need to sign in instead?"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="New password"
          name="password"
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          required
        />
        <InputField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          required
        />
        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {success}
          </div>
        ) : null}
        <button
          type="submit"
          className="block w-full"
          disabled={isSubmitting || !token}
        >
          <PrimaryButton
            className={
              isSubmitting || !token ? "cursor-not-allowed opacity-80" : ""
            }
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </PrimaryButton>
        </button>
      </form>
    </AuthShell>
  );
}
