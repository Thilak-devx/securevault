import { useState } from "react";
import AuthShell from "../components/AuthShell";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { forgotPasswordRequest } from "../lib/authApi";
import { getApiErrorMessage } from "../lib/apiError";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");
      const response = await forgotPasswordRequest({ email });
      setSuccess(
        response.data?.message || "Password reset link sent to your email.",
      );
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "We couldn't send a reset email. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we’ll send you a secure link to reset your password."
      ctaLabel="Back to login"
      ctaTo="/login"
      ctaText="Remembered it?"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
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
        <button type="submit" className="block w-full" disabled={isSubmitting}>
          <PrimaryButton className={isSubmitting ? "cursor-not-allowed opacity-80" : ""}>
            {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
          </PrimaryButton>
        </button>
        <p className="text-center text-xs leading-5 text-textSecondary">
          We’ll send a reset link to your inbox if the account exists.
        </p>
      </form>
    </AuthShell>
  );
}
