import rateLimit from "express-rate-limit";

function createAuthLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  });
}

export const loginRateLimiter = createAuthLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again in 15 minutes.",
});

export const forgotPasswordRateLimiter = createAuthLimiter({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message:
    "Too many password reset requests. Please try again in 15 minutes.",
});
