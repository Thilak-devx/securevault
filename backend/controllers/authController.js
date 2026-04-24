import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "../config/mailer.js";
import { Note, User } from "../models/index.js";

const googleClient = new OAuth2Client();

function createToken(user) {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1h";

  if (!jwtSecret) {
    throw new Error("Missing JWT_SECRET environment variable.");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn },
  );
}

function createAuthPayload(user) {
  return {
    token: createToken(user),
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  };
}

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const user = await User.create({
      email,
      password,
      ...(name ? { name } : {}),
    });

    return res.status(201).json(createAuthPayload(user));
  } catch (error) {
    console.error("Register error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    if (error?.name === "ValidationError") {
      const firstMessage = Object.values(error.errors || {})[0]?.message;

      return res.status(400).json({
        message: firstMessage || "Please check your registration details and try again.",
      });
    }

    return res.status(500).json({ message: "Unable to register user." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.password) {
      return res.status(401).json({
        message: "This account uses Google Sign-In. Continue with Google instead.",
      });
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json(createAuthPayload(user));
  } catch {
    return res.status(500).json({ message: "Unable to log in." });
  }
}

export async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      return res
        .status(500)
        .json({ message: "Google Sign-In is not configured on the server." });
    }

    if (!credential) {
      return res
        .status(400)
        .json({ message: "Google credential token is required." });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.sub) {
      return res
        .status(401)
        .json({ message: "Unable to verify your Google account." });
    }

    let user = await User.findOne({ email: payload.email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    return res.json(createAuthPayload(user));
  } catch (error) {
    console.error("Google sign-in error:", error);
    const googleErrorMessage = String(error?.message || "").trim();

    if (googleErrorMessage.includes("Wrong recipient")) {
      return res.status(401).json({
        message: "Google OAuth client mismatch. Make sure VITE_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID match the same Google app.",
      });
    }

    if (googleErrorMessage.includes("Token used too early")) {
      return res.status(401).json({
        message: "Google sign-in token is not valid yet. Please try again.",
      });
    }

    if (googleErrorMessage.includes("audience")) {
      return res.status(401).json({
        message: "Google OAuth audience mismatch. Verify that your frontend and backend are using the same Google client ID.",
      });
    }

    if (googleErrorMessage.includes("Token expired")) {
      return res.status(401).json({
        message: "Google sign-in token expired. Please try again.",
      });
    }

    if (googleErrorMessage.includes("Malformed")) {
      return res.status(401).json({
        message: "Google returned an invalid credential token. Try signing in again.",
      });
    }

    if (googleErrorMessage) {
      return res.status(401).json({
        message: `Google verification failed: ${googleErrorMessage}`,
      });
    }

    return res.status(401).json({ message: "Google sign-in failed." });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "No account found with that email." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password/${resetToken}`;

    await sendPasswordResetEmail({
      to: user.email,
      resetLink,
    });

    return res.json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Forgot password email error:", error);

    if (
      error.message ===
      "Missing EMAIL_USER or EMAIL_PASS environment variable."
    ) {
      return res.status(500).json({
        message:
          "Email service is not configured. Add EMAIL_USER and EMAIL_PASS to the backend .env file.",
      });
    }

    return res.status(500).json({ message: "Unable to send reset email." });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "New password is required." });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or expired." });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({ message: "Password reset successful." });
  } catch {
    return res.status(500).json({ message: "Unable to reset password." });
  }
}

export async function deleteAccount(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    await Note.deleteMany({ userId: user._id });
    await user.deleteOne();

    return res.json({ message: "Account deleted successfully." });
  } catch {
    return res.status(500).json({ message: "Unable to delete account." });
  }
}
