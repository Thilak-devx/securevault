import { Router } from "express";
import {
  createNote,
  deleteNote,
  getNotes,
  resetNotePassword,
  unlockNote,
  updateNote,
} from "../controllers/noteController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createNoteValidation,
  resetNotePasswordValidation,
  unlockNoteValidation,
  updateNoteValidation,
} from "../middleware/validation.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getNotes);
router.post("/", createNoteValidation, createNote);
router.post("/unlock/:id", unlockNoteValidation, unlockNote);
router.post("/reset-lock/:id", resetNotePasswordValidation, resetNotePassword);
router.put("/:id", updateNoteValidation, updateNote);
router.delete("/:id", deleteNote);

export default router;
