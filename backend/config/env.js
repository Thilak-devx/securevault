const REQUIRED_SERVER_ENV = ["MONGODB_URI", "JWT_SECRET", "ENCRYPTION_KEY"];
const OPTIONAL_FEATURE_ENV = {
  GOOGLE_CLIENT_ID: "Google sign-in will be disabled until GOOGLE_CLIENT_ID is configured.",
  EMAIL_USER: "Password reset email will be disabled until EMAIL_USER is configured.",
  EMAIL_PASS: "Password reset email will be disabled until EMAIL_PASS is configured.",
};
const PLACEHOLDER_PATTERNS = [
  /your-/i,
  /replace-with/i,
  /^changeme$/i,
  /^example$/i,
  /^test$/i,
];

function isPlaceholder(value) {
  const normalizedValue = String(value ?? "").trim();

  if (!normalizedValue) {
    return true;
  }

  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(normalizedValue));
}

export function validateServerEnv() {
  const missingRequired = REQUIRED_SERVER_ENV.filter((key) =>
    isPlaceholder(process.env[key]),
  );

  if (missingRequired.length) {
    throw new Error(
      `Missing required server environment variables: ${missingRequired.join(", ")}.`,
    );
  }

  if (
    isPlaceholder(process.env.CLIENT_URL) &&
    isPlaceholder(process.env.FRONTEND_URL)
  ) {
    console.warn(
      "[env] CLIENT_URL / FRONTEND_URL not configured. CORS may block frontend requests in non-local environments.",
    );
  }

  Object.entries(OPTIONAL_FEATURE_ENV).forEach(([key, warning]) => {
    if (isPlaceholder(process.env[key])) {
      console.warn(`[env] ${warning}`);
    }
  });
}
