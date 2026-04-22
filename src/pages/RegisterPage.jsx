import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../lib/apiError";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "We couldn't create your account. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Set up your encrypted notes space with a clean, secure workflow built for focused work."
      ctaLabel="Sign in"
      ctaTo="/login"
      ctaText="Already have an account?"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="Full name"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />
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
          placeholder="Create a strong password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        <InputField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        <button type="submit" className="block w-full" disabled={isSubmitting}>
          <PrimaryButton className={isSubmitting ? "opacity-70" : ""}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </PrimaryButton>
        </button>
        <p className="pt-1 text-center text-xs leading-5 text-textSecondary">
          Your notes stay private with encrypted sync and secure access controls.
        </p>
      </form>
    </AuthShell>
  );
}
