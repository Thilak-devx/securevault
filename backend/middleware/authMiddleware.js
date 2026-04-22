import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT secret is not configured." });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please log in to continue.",
      code: "AUTH_TOKEN_MISSING",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = {
      id: payload.id,
      email: payload.email,
    };
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Your session has expired. Please log in again.",
        code: "AUTH_TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      message: "Your session is invalid. Please log in again.",
      code: "AUTH_TOKEN_INVALID",
    });
  }
}

export default authMiddleware;
