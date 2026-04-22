import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      maxlength: 160,
    },
    content: {
      type: String,
      required: [true, "Content is required."],
      trim: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    notePassword: {
      type: String,
      trim: true,
      default: "",
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required."],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;
