import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Note, User } from "../models/index.js";
import { decryptNote, encryptText } from "../utils/noteCrypto.js";

const MIN_NOTE_TITLE_LENGTH = 2;
const MIN_NOTE_CONTENT_LENGTH = 3;
const MIN_NOTE_PASSWORD_LENGTH = 4;

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function handleEncryptionConfigError(error, res) {
  if (error.message === "Missing ENCRYPTION_KEY environment variable.") {
    return res.status(500).json({
      message: "Notes encryption is not configured on the server.",
    });
  }

  return null;
}

export async function getNotes(req, res) {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({
      pinned: -1,
      updatedAt: -1,
    });

    return res.json({ notes: notes.map((note) => decryptNote(note)) });
  } catch (error) {
    const handledResponse = handleEncryptionConfigError(error, res);

    if (handledResponse) {
      return handledResponse;
    }

    return res.status(500).json({ message: "Unable to fetch notes." });
  }
}

export async function createNote(req, res) {
  try {
    const {
      title,
      content,
      pinned = false,
      isLocked = false,
      notePassword = "",
    } = req.body;
    const normalizedTitle = normalizeString(title);
    const normalizedContent = normalizeString(content);
    const normalizedNotePassword = normalizeString(notePassword);

    if (!normalizedTitle || !normalizedContent) {
      return res.status(400).json({
        message: "Note title and content cannot be empty.",
      });
    }

    if (normalizedTitle.length < MIN_NOTE_TITLE_LENGTH) {
      return res.status(400).json({
        message: `Note title must be at least ${MIN_NOTE_TITLE_LENGTH} characters long.`,
      });
    }

    if (normalizedContent.length < MIN_NOTE_CONTENT_LENGTH) {
      return res.status(400).json({
        message: `Note content must be at least ${MIN_NOTE_CONTENT_LENGTH} characters long.`,
      });
    }

    if (isLocked && !normalizedNotePassword) {
      return res.status(400).json({
        message: "A password is required when locking a note.",
      });
    }

    if (isLocked && normalizedNotePassword.length < MIN_NOTE_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `Note password must be at least ${MIN_NOTE_PASSWORD_LENGTH} characters long.`,
      });
    }

    const hashedNotePassword = isLocked
      ? await bcrypt.hash(normalizedNotePassword, 10)
      : "";

    const note = await Note.create({
      title: encryptText(normalizedTitle),
      content: encryptText(normalizedContent),
      isLocked,
      notePassword: hashedNotePassword,
      pinned,
      userId: req.user.id,
    });

    return res.status(201).json({ note: decryptNote(note) });
  } catch (error) {
    const handledResponse = handleEncryptionConfigError(error, res);

    if (handledResponse) {
      return handledResponse;
    }

    return res.status(500).json({ message: "Unable to create note." });
  }
}

export async function updateNote(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid note ID." });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this note." });
    }

    const { title, content, pinned, isLocked, notePassword = "" } = req.body;
    const normalizedTitle = typeof title === "string" ? normalizeString(title) : null;
    const normalizedContent = typeof content === "string" ? normalizeString(content) : null;
    const normalizedNotePassword = normalizeString(notePassword);

    if (typeof title === "string") {
      if (!normalizedTitle) {
        return res.status(400).json({
          message: "Note title cannot be empty.",
        });
      }

      if (normalizedTitle.length < MIN_NOTE_TITLE_LENGTH) {
        return res.status(400).json({
          message: `Note title must be at least ${MIN_NOTE_TITLE_LENGTH} characters long.`,
        });
      }

      note.title = encryptText(normalizedTitle);
    }

    if (typeof content === "string") {
      if (!normalizedContent) {
        return res.status(400).json({
          message: "Note content cannot be empty.",
        });
      }

      if (normalizedContent.length < MIN_NOTE_CONTENT_LENGTH) {
        return res.status(400).json({
          message: `Note content must be at least ${MIN_NOTE_CONTENT_LENGTH} characters long.`,
        });
      }

      note.content = encryptText(normalizedContent);
    }

    if (typeof pinned === "boolean") {
      note.pinned = pinned;
    }

    if (typeof isLocked === "boolean") {
      if (isLocked && !note.isLocked && !normalizedNotePassword) {
        return res.status(400).json({
          message: "A password is required when locking a note.",
        });
      }

      note.isLocked = isLocked;

      if (!isLocked) {
        note.notePassword = "";
      }
    }

    if ((typeof isLocked === "boolean" ? isLocked : note.isLocked) && normalizedNotePassword) {
      if (normalizedNotePassword.length < MIN_NOTE_PASSWORD_LENGTH) {
        return res.status(400).json({
          message: `Note password must be at least ${MIN_NOTE_PASSWORD_LENGTH} characters long.`,
        });
      }

      note.notePassword = await bcrypt.hash(normalizedNotePassword, 10);
    }

    await note.save();

    return res.json({ note: decryptNote(note) });
  } catch (error) {
    const handledResponse = handleEncryptionConfigError(error, res);

    if (handledResponse) {
      return handledResponse;
    }

    return res.status(500).json({ message: "Unable to update note." });
  }
}

export async function unlockNote(req, res) {
  try {
    const { id } = req.params;
    const password = normalizeString(req.body?.password);

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid note ID." });
    }

    if (!password) {
      return res.status(400).json({
        message: "Enter the note password to unlock this note.",
      });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to unlock this note." });
    }

    if (!note.isLocked || !note.notePassword) {
      return res.json({ note: decryptNote(note, { revealLockedContent: true }) });
    }

    const passwordMatches = await bcrypt.compare(password, note.notePassword);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Incorrect note password." });
    }

    return res.json({
      note: decryptNote(note, {
        revealLockedContent: true,
      }),
    });
  } catch (error) {
    const handledResponse = handleEncryptionConfigError(error, res);

    if (handledResponse) {
      return handledResponse;
    }

    return res.status(500).json({ message: "Unable to unlock note." });
  }
}

export async function resetNotePassword(req, res) {
  try {
    const { id } = req.params;
    const accountPassword = normalizeString(req.body?.accountPassword);
    const newNotePassword = normalizeString(req.body?.newNotePassword);

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid note ID." });
    }

    if (!accountPassword || !newNotePassword) {
      return res.status(400).json({
        message: "Account password and new note password are required.",
      });
    }

    if (newNotePassword.length < MIN_NOTE_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `New note password must be at least ${MIN_NOTE_PASSWORD_LENGTH} characters long.`,
      });
    }

    const [note, user] = await Promise.all([
      Note.findById(id),
      User.findById(req.user.id),
    ]);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to recover this note." });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Account password recovery is unavailable for Google sign-in accounts.",
      });
    }

    const accountPasswordMatches = await user.comparePassword(accountPassword);

    if (!accountPasswordMatches) {
      return res.status(401).json({ message: "Incorrect account password." });
    }

    note.isLocked = true;
    note.notePassword = await bcrypt.hash(newNotePassword, 10);
    await note.save();

    return res.json({
      message: "Note password reset successful.",
      note: decryptNote(note, { revealLockedContent: true }),
    });
  } catch (error) {
    const handledResponse = handleEncryptionConfigError(error, res);

    if (handledResponse) {
      return handledResponse;
    }

    return res.status(500).json({ message: "Unable to reset note password." });
  }
}

export async function deleteNote(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid note ID." });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    if (note.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this note." });
    }

    await note.deleteOne();

    return res.json({ message: "Note deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete note." });
  }
}
