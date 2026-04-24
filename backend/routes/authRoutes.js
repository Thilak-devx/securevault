import { Router } from "express";
import {
  deleteAccount,
  forgotPassword,
  googleLogin,
  login,
  register,
  resetPassword,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  forgotPasswordRateLimiter,
  loginRateLimiter,
} from "../middleware/rateLimiters.js";
import {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
} from "../middleware/validation.js";

const router = Router();
router.post("/register", registerValidation, register);
router.post("/login", loginRateLimiter, loginValidation, login);
router.post("/google-login", googleLogin);
router.post(
  "/forgot-password",
  forgotPasswordRateLimiter,
  forgotPasswordValidation,
  forgotPassword,
);
router.post("/reset-password/:token", resetPasswordValidation, resetPassword);
router.delete("/delete-account", authMiddleware, deleteAccount);

export default router;
