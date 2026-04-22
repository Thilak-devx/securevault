import { body, validationResult } from "express-validator";

function sanitizeSingleLineText(value) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeMultilineText(value) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  res.status(400).json({
    message: "Validation failed.",
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
}

export const registerValidation = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter a valid email address."),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("name")
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage("Name must be 120 characters or fewer.")
    .escape(),
  handleValidationErrors,
];

export const loginValidation = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter a valid email address."),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  handleValidationErrors,
];

export const forgotPasswordValidation = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter a valid email address."),
  handleValidationErrors,
];

export const resetPasswordValidation = [
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  handleValidationErrors,
];

export const googleLoginValidation = [
  body("credential")
    .trim()
    .notEmpty()
    .withMessage("Google credential token is required."),
  handleValidationErrors,
];

export const createNoteValidation = [
  body("title")
    .customSanitizer(sanitizeSingleLineText)
    .isLength({ min: 2, max: 160 })
    .withMessage("Note title must be between 2 and 160 characters."),
  body("content")
    .customSanitizer(sanitizeMultilineText)
    .isLength({ min: 3, max: 10000 })
    .withMessage("Note content must be between 3 and 10000 characters."),
  body("isLocked")
    .optional()
    .isBoolean()
    .withMessage("Lock state must be true or false.")
    .toBoolean(),
  body("notePassword")
    .optional()
    .customSanitizer(sanitizeSingleLineText)
    .isLength({ max: 128 })
    .withMessage("Note password must be 128 characters or fewer."),
  body("pinned")
    .optional()
    .isBoolean()
    .withMessage("Pinned state must be true or false.")
    .toBoolean(),
  handleValidationErrors,
];

export const updateNoteValidation = [
  body("title")
    .optional()
    .customSanitizer(sanitizeSingleLineText)
    .isLength({ min: 2, max: 160 })
    .withMessage("Note title must be between 2 and 160 characters."),
  body("content")
    .optional()
    .customSanitizer(sanitizeMultilineText)
    .isLength({ min: 3, max: 10000 })
    .withMessage("Note content must be between 3 and 10000 characters."),
  body("isLocked")
    .optional()
    .isBoolean()
    .withMessage("Lock state must be true or false.")
    .toBoolean(),
  body("notePassword")
    .optional()
    .customSanitizer(sanitizeSingleLineText)
    .isLength({ max: 128 })
    .withMessage("Note password must be 128 characters or fewer."),
  body("pinned")
    .optional()
    .isBoolean()
    .withMessage("Pinned state must be true or false.")
    .toBoolean(),
  handleValidationErrors,
];

export const unlockNoteValidation = [
  body("password")
    .customSanitizer(sanitizeSingleLineText)
    .notEmpty()
    .withMessage("Enter the note password to unlock this note."),
  handleValidationErrors,
];

export const resetNotePasswordValidation = [
  body("accountPassword")
    .customSanitizer(sanitizeSingleLineText)
    .notEmpty()
    .withMessage("Account password is required."),
  body("newNotePassword")
    .customSanitizer(sanitizeSingleLineText)
    .isLength({ min: 4, max: 128 })
    .withMessage("New note password must be between 4 and 128 characters."),
  handleValidationErrors,
];
