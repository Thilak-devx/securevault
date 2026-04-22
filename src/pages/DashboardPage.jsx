import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterTabs from "../components/FilterTabs";
import ConfirmDialog from "../components/ConfirmDialog";
import DashboardState from "../components/DashboardState";
import FloatingAddButton from "../components/FloatingAddButton";
import NoteDetailModal from "../components/NoteDetailModal";
import NoteModal from "../components/NoteModal";
import NoteCard from "../components/NoteCard";
import NoteCardSkeleton from "../components/NoteCardSkeleton";
import SearchBar from "../components/SearchBar";
import SecureMascot from "../components/SecureMascot";
import Sidebar from "../components/Sidebar";
import UnlockNoteModal from "../components/UnlockNoteModal";
import {
  createNote,
  deleteNote,
  getNotes,
  resetNotePassword,
  unlockNote,
  updateNote,
} from "../lib/notesApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getApiErrorMessage } from "../lib/apiError";

const initialForm = {
  title: "",
  content: "",
  category: "All",
  tag: "Personal",
  isLocked: false,
  notePassword: "",
};
const MIN_NOTE_TITLE_LENGTH = 2;
const MIN_NOTE_CONTENT_LENGTH = 3;
const MIN_NOTE_PASSWORD_LENGTH = 4;
const LAST_OPENED_NOTE_STORAGE_KEY = "secure_notes_last_opened_note";

function sortNotesByPinned(items) {
  return [...items].sort((left, right) => {
    if (left.pinned !== right.pinned) {
      return Number(right.pinned) - Number(left.pinned);
    }

    return 0;
  });
}

function formatNoteTimestamp(value) {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatNoteDateTime(value) {
  if (!value) {
    return "Unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getLatestUpdatedAt(items) {
  if (!items.length) {
    return "No recent updates";
  }

  const timestamps = items
    .map((item) => item.updatedAtRaw ?? item.createdAtRaw)
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => right.getTime() - left.getTime());

  if (!timestamps.length) {
    return "No recent updates";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamps[0]);
}

function normalizeNote(note, options = {}) {
  const { revealLockedContent = false } = options;
  const isLocked = Boolean(note.isLocked);
  const noteContent = isLocked && !revealLockedContent
    ? ""
    : note.content ?? note.body ?? "";

  return {
    id: note.id ?? note._id,
    userId: note.userId ?? note.ownerId ?? null,
    title: note.title ?? "Untitled note",
    content: noteContent,
    pinned: Boolean(note.pinned),
    isLocked,
    isUnlocked: Boolean(note.isUnlocked) || revealLockedContent,
    category:
      note.category ??
      (note.pinned ? "Pinned" : note.bookmarked ? "Bookmarked" : "All"),
    tag: note.tag ?? "Personal",
    createdAtRaw: note.createdAt ?? null,
    updatedAtRaw: note.updatedAt ?? note.createdAt ?? null,
    time: formatNoteTimestamp(note.updatedAt ?? note.createdAt),
    createdAt: formatNoteDateTime(note.createdAt),
    updatedAt: formatNoteDateTime(note.updatedAt),
  };
}

function validateNoteForm(form, existingLockedNote = false) {
  const normalizedTitle = form.title.trim();
  const normalizedContent = form.content.trim();
  const normalizedNotePassword = form.notePassword.trim();

  if (!normalizedTitle || !normalizedContent) {
    return "Note title and content cannot be empty.";
  }

  if (normalizedTitle.length < MIN_NOTE_TITLE_LENGTH) {
    return `Note title must be at least ${MIN_NOTE_TITLE_LENGTH} characters long.`;
  }

  if (normalizedContent.length < MIN_NOTE_CONTENT_LENGTH) {
    return `Note content must be at least ${MIN_NOTE_CONTENT_LENGTH} characters long.`;
  }

  if (form.isLocked) {
    if (!existingLockedNote && !normalizedNotePassword) {
      return "A password is required when locking a note.";
    }

    if (normalizedNotePassword && normalizedNotePassword.length < MIN_NOTE_PASSWORD_LENGTH) {
      return `Note password must be at least ${MIN_NOTE_PASSWORD_LENGTH} characters long.`;
    }
  }

  return "";
}

function getLastOpenedNoteStorageKey(userEmail) {
  return userEmail
    ? `${LAST_OPENED_NOTE_STORAGE_KEY}:${userEmail}`
    : LAST_OPENED_NOTE_STORAGE_KEY;
}

export default function DashboardPage() {
  const INACTIVITY_TIMEOUT_MS = 2 * 60 * 1000;
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const inactivityTimeoutRef = useRef(null);
  const hasRestoredLastOpenedRef = useRef(false);
  const [activeTab, setActiveTab] = useState("All");
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [sessionLockMessage, setSessionLockMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailEditMode, setDetailEditMode] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const [newNotePassword, setNewNotePassword] = useState("");
  const [isResettingNotePassword, setIsResettingNotePassword] = useState(false);
  const [notePendingUnlock, setNotePendingUnlock] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [pinningId, setPinningId] = useState(null);
  const [notePendingDelete, setNotePendingDelete] = useState(null);
  const [recentlyCreatedNoteId, setRecentlyCreatedNoteId] = useState(null);

  function persistLastOpenedNote(noteId) {
    if (!noteId) {
      return;
    }

    localStorage.setItem(getLastOpenedNoteStorageKey(user?.email), noteId);
  }

  function clearLastOpenedNote(noteId) {
    const storageKey = getLastOpenedNoteStorageKey(user?.email);
    const storedNoteId = localStorage.getItem(storageKey);

    if (!noteId || storedNoteId === noteId) {
      localStorage.removeItem(storageKey);
    }
  }

  async function loadNotes() {
    try {
      setLoading(true);
      setFetchError("");
      const response = await getNotes();
      const incomingNotes = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.notes)
          ? response.data.notes
          : [];

      setNotes(sortNotesByPinned(incomingNotes.map(normalizeNote)));
    } catch (error) {
      if (error.response?.status === 403) {
        setFetchError("You are not authorized to view these notes.");
        return;
      }

      setFetchError(
        getApiErrorMessage(
          error,
          "Unable to load notes right now. Please check your API connection.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (loading || hasRestoredLastOpenedRef.current || !notes.length) {
      return;
    }

    const storageKey = getLastOpenedNoteStorageKey(user?.email);
    const lastOpenedNoteId = localStorage.getItem(storageKey);

    hasRestoredLastOpenedRef.current = true;

    if (!lastOpenedNoteId) {
      return;
    }

    const matchingNote = notes.find((note) => note.id === lastOpenedNoteId);

    if (!matchingNote) {
      localStorage.removeItem(storageKey);
      return;
    }

    openNoteDetail(matchingNote);
  }, [loading, notes, user?.email]);

  useEffect(() => {
    function lockSessionForInactivity() {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.isLocked ? { ...note, isUnlocked: false, content: "" } : note,
        ),
      );
      setSelectedNote(null);
      setDetailModalOpen(false);
      setDetailEditMode(false);
      setCurrentNoteId(null);
      setForm(initialForm);
      setSaveError("");
      setNotePendingUnlock(null);
      setUnlockPassword("");
      setUnlockError("");
      setIsRecoveryMode(false);
      setAccountPassword("");
      setNewNotePassword("");
      setSessionLockMessage("Session locked due to inactivity.");
      showToast({
        title: "Session locked",
        description: "Session locked due to inactivity.",
        tone: "error",
      });
    }

    function resetInactivityTimer() {
      if (inactivityTimeoutRef.current) {
        window.clearTimeout(inactivityTimeoutRef.current);
      }

      inactivityTimeoutRef.current = window.setTimeout(
        lockSessionForInactivity,
        INACTIVITY_TIMEOUT_MS,
      );
    }

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer, { passive: true });
    });

    resetInactivityTimer();

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer);
      });

      if (inactivityTimeoutRef.current) {
        window.clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [showToast]);

  function openCreateModal() {
    setCurrentNoteId(null);
    setForm(initialForm);
    setSaveError("");
    setSessionLockMessage("");
    setModalOpen(true);
  }

  function openNoteDetail(note, startInEdit = false) {
    persistLastOpenedNote(note.id);

    if (note.isLocked && !note.isUnlocked) {
      setNotePendingUnlock(note);
      setUnlockPassword("");
      setUnlockError("");
      setIsRecoveryMode(false);
      setAccountPassword("");
      setNewNotePassword("");
      return;
    }

    setSelectedNote(note);
    setCurrentNoteId(note.id);
    setForm({
      title: note.title,
      content: note.content,
      category: note.category,
      tag: note.tag,
      isLocked: note.isLocked,
      notePassword: "",
    });
    setDetailEditMode(startInEdit);
    setSaveError("");
    setSessionLockMessage("");
    setDetailModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setCurrentNoteId(null);
    setForm(initialForm);
    setSaveError("");
  }

  function closeDetailModal() {
    if (isSaving) {
      return;
    }

    setDetailModalOpen(false);
    setDetailEditMode(false);
    setSelectedNote(null);
    setCurrentNoteId(null);
    setForm(initialForm);
    setSaveError("");
  }

  function handleToggleDetailEdit() {
    if (!selectedNote) {
      return;
    }

    if (detailEditMode) {
      setForm({
        title: selectedNote.title,
        content: selectedNote.content,
        category: selectedNote.category,
        tag: selectedNote.tag,
        isLocked: selectedNote.isLocked,
        notePassword: "",
      });
      setSaveError("");
      setDetailEditMode(false);
      return;
    }

    setForm({
      title: selectedNote.title,
      content: selectedNote.content,
      category: selectedNote.category,
      tag: selectedNote.tag,
    });
    setSaveError("");
    setDetailEditMode(true);
  }

  function handleFormChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function closeUnlockModal() {
    if (isUnlocking) {
      return;
    }

    setNotePendingUnlock(null);
    setUnlockPassword("");
    setUnlockError("");
    setIsRecoveryMode(false);
    setAccountPassword("");
    setNewNotePassword("");
  }

  async function handleUnlockSubmit(event) {
    event.preventDefault();

    if (!notePendingUnlock) {
      return;
    }

    if (!unlockPassword.trim()) {
      setUnlockError("Enter the note password to unlock this note.");
      return;
    }

    try {
      setIsUnlocking(true);
      setUnlockError("");
      const response = await unlockNote(notePendingUnlock.id, unlockPassword.trim());
      const unlockedNote = normalizeNote(response.data?.note ?? response.data, {
        revealLockedContent: true,
      });

      persistLastOpenedNote(unlockedNote.id);
      setSelectedNote(unlockedNote);
      setCurrentNoteId(unlockedNote.id);
      setForm({
        title: unlockedNote.title,
        content: unlockedNote.content,
        category: unlockedNote.category,
        tag: unlockedNote.tag,
        isLocked: unlockedNote.isLocked,
        notePassword: "",
      });
      setDetailEditMode(false);
      setNotePendingUnlock(null);
      setUnlockPassword("");
      window.setTimeout(() => {
        setDetailModalOpen(true);
      }, 180);
      showToast({
        title: "Note unlocked",
        description: "Protected note opened successfully.",
      });
      setSessionLockMessage("");
    } catch (error) {
      setUnlockError(
        getApiErrorMessage(error, "Unable to unlock this note."),
      );
      showToast({
        title: "Unlock failed",
        description: getApiErrorMessage(error, "Check the note password and try again."),
        tone: "error",
      });
    } finally {
      setIsUnlocking(false);
    }
  }

  async function handleResetNotePasswordSubmit(event) {
    event.preventDefault();

    if (!notePendingUnlock) {
      return;
    }

    if (!accountPassword.trim() || !newNotePassword.trim()) {
      setUnlockError("Account password and new note password are required.");
      return;
    }

    if (newNotePassword.trim().length < MIN_NOTE_PASSWORD_LENGTH) {
      setUnlockError(`New note password must be at least ${MIN_NOTE_PASSWORD_LENGTH} characters long.`);
      return;
    }

    try {
      setIsResettingNotePassword(true);
      setUnlockError("");
      const response = await resetNotePassword(notePendingUnlock.id, {
        accountPassword: accountPassword.trim(),
        newNotePassword: newNotePassword.trim(),
      });
      const recoveredNote = normalizeNote(response.data?.note ?? response.data, {
        revealLockedContent: true,
      });

      setSelectedNote(recoveredNote);
      setCurrentNoteId(recoveredNote.id);
      setForm({
        title: recoveredNote.title,
        content: recoveredNote.content,
        category: recoveredNote.category,
        tag: recoveredNote.tag,
        isLocked: recoveredNote.isLocked,
        notePassword: "",
      });
      setDetailEditMode(false);
      setNotePendingUnlock(null);
      setIsRecoveryMode(false);
      setAccountPassword("");
      setNewNotePassword("");
      window.setTimeout(() => {
        setDetailModalOpen(true);
      }, 180);
      showToast({
        title: "Note password reset",
        description: "Your account password was verified and the note is now open.",
      });
      setSessionLockMessage("");
    } catch (error) {
      setUnlockError(
        getApiErrorMessage(error, "Unable to reset the note password."),
      );
      showToast({
        title: "Reset failed",
        description: getApiErrorMessage(error, "Please verify your account password and try again."),
        tone: "error",
      });
    } finally {
      setIsResettingNotePassword(false);
    }
  }

  async function handleCreateSubmit(event) {
    event.preventDefault();

    const validationError = validateNoteForm(form);

    if (validationError) {
      setSaveError(validationError);
      return;
    }

    try {
      setIsSaving(true);
      setSaveError("");

      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category,
        tag: form.tag,
        isLocked: form.isLocked,
        notePassword: form.notePassword.trim(),
      };

      const response = await createNote(payload);
      const createdNote = normalizeNote(response.data?.note ?? response.data);
      setNotes((currentNotes) =>
        sortNotesByPinned([createdNote, ...currentNotes]),
      );
      setRecentlyCreatedNoteId(createdNote.id);
      window.setTimeout(() => {
        setRecentlyCreatedNoteId((currentId) =>
          currentId === createdNote.id ? null : currentId,
        );
      }, 1800);
      showToast({
        title: "Note created",
        description: "Your new note was added to the workspace.",
      });

      closeModal();
    } catch (error) {
      if (error.response?.status === 403) {
        setSaveError("You can only edit notes that belong to your account.");
        return;
      }

      setSaveError(
        getApiErrorMessage(error, "We couldn't save your note. Please try again."),
      );
      showToast({
        title: "Unable to create note",
        description: getApiErrorMessage(error, "Please try again."),
        tone: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDetailSubmit(event) {
    event.preventDefault();

    if (!currentNoteId) {
      return;
    }

    const validationError = validateNoteForm(form, Boolean(selectedNote?.isLocked));

    if (validationError) {
      setSaveError(validationError);
      return;
    }

    try {
      setIsSaving(true);
      setSaveError("");

      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category,
        tag: form.tag,
        isLocked: form.isLocked,
        notePassword: form.notePassword.trim(),
      };

      const response = await updateNote(currentNoteId, payload);
      const updatedNote = normalizeNote(response.data?.note ?? response.data, {
        revealLockedContent: true,
      });
      const listNote = normalizeNote(response.data?.note ?? response.data);

      setNotes((currentNotes) =>
        sortNotesByPinned(
          currentNotes.map((note) =>
            note.id === currentNoteId ? listNote : note,
          ),
        ),
      );
      setSelectedNote(updatedNote);
      setDetailEditMode(false);
      showToast({
        title: "Note updated",
        description: "Your changes were saved successfully.",
      });
    } catch (error) {
      if (error.response?.status === 403) {
        setSaveError("You can only edit notes that belong to your account.");
        return;
      }

      setSaveError(
        getApiErrorMessage(error, "We couldn't save your note. Please try again."),
      );
      showToast({
        title: "Unable to update note",
        description: getApiErrorMessage(error, "Please try again."),
        tone: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function requestDelete(note) {
    setNotePendingDelete(note);
  }

  function closeDeleteDialog() {
    if (deletingId) {
      return;
    }

    setNotePendingDelete(null);
  }

  async function handleDelete(noteId) {
    try {
      setDeletingId(noteId);
      setFetchError("");
      await deleteNote(noteId);
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteId),
      );
      clearLastOpenedNote(noteId);
      setNotePendingDelete(null);
      showToast({
        title: "Note deleted",
        description: "The note was removed from your workspace.",
      });
    } catch (error) {
      if (error.response?.status === 403) {
        setFetchError("You can only delete notes that belong to your account.");
        return;
      }

      setFetchError(
        getApiErrorMessage(error, "We couldn't delete that note. Please try again."),
      );
      showToast({
        title: "Unable to delete note",
        description: getApiErrorMessage(error, "Please try again."),
        tone: "error",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleTogglePin(note) {
    try {
      setPinningId(note.id);
      setFetchError("");
      const response = await updateNote(note.id, {
        pinned: !note.pinned,
      });
      const updatedNote = normalizeNote(response.data?.note ?? response.data);
      setNotes((currentNotes) =>
        sortNotesByPinned(
          currentNotes.map((currentNote) =>
            currentNote.id === note.id ? updatedNote : currentNote,
          ),
        ),
      );
      showToast({
        title: updatedNote.pinned ? "Note pinned" : "Note unpinned",
        description: updatedNote.pinned
          ? "Pinned notes stay at the top of your workspace."
          : "The note returned to its normal position.",
      });
    } catch (error) {
      setFetchError(
        getApiErrorMessage(error, "We couldn't update the pin state."),
      );
      showToast({
        title: "Unable to update pin",
        description: getApiErrorMessage(error, "Please try again."),
        tone: "error",
      });
    } finally {
      setPinningId(null);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const filteredNotes =
    activeTab === "All"
      ? notes
      : activeTab === "Pinned"
        ? notes.filter((note) => note.pinned)
        : notes.filter((note) => note.category === activeTab);

  const visibleNotes = filteredNotes.filter((note) => {
    if (!searchTerm.trim()) {
      return true;
    }

    const query = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  const hasSearchQuery = Boolean(searchTerm.trim());
  const hasAnyNotes = notes.length > 0;
  const statItems = [
    {
      label: "Total notes",
      value: notes.length,
    },
    {
      label: "Pinned notes",
      value: notes.filter((note) => note.pinned).length,
    },
    {
      label: "Last updated",
      value: getLatestUpdatedAt(notes),
    },
  ];

  return (
    <div className="min-h-screen bg-hero-radial px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex w-full max-w-[1500px] items-start gap-6 xl:gap-8">
        <Sidebar onLogout={handleLogout} userEmail={user?.email} />
        <main className="w-full flex-1">
          <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.9),rgba(15,23,42,0.76))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
            <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-[2rem] font-semibold tracking-[-0.035em] text-textPrimary sm:text-[2.5rem]">
                  Your Notes
                </h1>
                <p className="mt-2.5 max-w-xl text-sm leading-6 text-textSecondary">
                  Secure your thoughts with end-to-end protection.
                </p>
              </div>
              <div className="grid gap-4 sm:min-w-[390px] sm:grid-cols-3">
                {statItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4.5 text-left shadow-[0_14px_34px_rgba(0,0,0,0.14)]"
                  >
                    <p className="text-[11px] uppercase tracking-[0.24em] text-textSecondary">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-base font-semibold tracking-[-0.02em] text-textPrimary">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-3.5">
              <FilterTabs activeTab={activeTab} onChange={setActiveTab} />
              <SearchBar
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onClear={() => setSearchTerm("")}
              />
              {sessionLockMessage ? (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                  {sessionLockMessage}
                </div>
              ) : null}
              {searchTerm.trim() ? (
                <p className="text-xs text-textSecondary">
                  {visibleNotes.length} result{visibleNotes.length === 1 ? "" : "s"} for
                  {" "}
                  <span className="font-medium text-textPrimary">"{searchTerm}"</span>
                </p>
              ) : null}
            </div>

            <div className="mx-auto mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <NoteCardSkeleton key={`note-skeleton-${index}`} />
                ))
              ) : null}

              {!loading && fetchError ? (
                <DashboardState
                  tone="error"
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="M12 8v5" />
                      <path d="M12 16h.01" />
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                    </svg>
                  }
                  title="Something went wrong"
                  description={fetchError}
                  action={
                    <button
                      type="button"
                      onClick={loadNotes}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-textPrimary transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] sm:w-auto"
                    >
                      Retry
                    </button>
                  }
                />
              ) : null}

              {!loading && !fetchError && !hasAnyNotes ? (
                <DashboardState
                  icon={<SecureMascot className="h-14 w-14" />}
                  title="No notes yet"
                  description="Your vault is ready. Create your first secure note and start capturing ideas."
                  action={
                    <button
                      type="button"
                      onClick={openCreateModal}
                      className="w-full rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_10px_24px_rgba(250,204,21,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow sm:w-auto"
                    >
                      Create First Note
                    </button>
                  }
                />
              ) : null}

              {!loading && !fetchError && hasAnyNotes && visibleNotes.length === 0 ? (
                <DashboardState
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.5-3.5" />
                    </svg>
                  }
                  title={hasSearchQuery ? "No matching notes" : "No notes in this view"}
                  description={
                    hasSearchQuery
                      ? "No matching notes found"
                      : "There are no notes in this filter yet. Switch tabs or create a new note."
                  }
                  action={
                    hasSearchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-textPrimary transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] sm:w-auto"
                      >
                        Clear Search
                      </button>
                    ) : null
                  }
                />
              ) : null}

              {!loading && !fetchError
                ? visibleNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      {...note}
                      searchQuery={searchTerm}
                      isPinning={pinningId === note.id}
                      isNew={recentlyCreatedNoteId === note.id}
                      onTogglePin={() => handleTogglePin(note)}
                      isDeleting={deletingId === note.id}
                      onOpen={() => openNoteDetail(note)}
                      onEdit={() => openNoteDetail(note, true)}
                      onDelete={() => requestDelete(note)}
                    />
                  ))
                : null}
            </div>
          </section>
        </main>
      </div>
      <FloatingAddButton onClick={openCreateModal} />
      <NoteModal
        isOpen={modalOpen}
        mode="create"
        form={form}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleCreateSubmit}
        isSaving={isSaving}
        error={saveError}
      />
      <NoteDetailModal
        isOpen={detailModalOpen}
        note={selectedNote}
        form={form}
        isEditing={detailEditMode}
        onChange={handleFormChange}
        onClose={closeDetailModal}
        onToggleEdit={handleToggleDetailEdit}
        onSubmit={handleDetailSubmit}
        isSaving={isSaving}
        error={saveError}
      />
      <ConfirmDialog
        isOpen={Boolean(notePendingDelete)}
        title="Delete this note?"
        description={`This will permanently remove "${notePendingDelete?.title || "this note"}" from your secure workspace.`}
        confirmLabel="Delete Note"
        isLoading={Boolean(notePendingDelete && deletingId === notePendingDelete.id)}
        onCancel={closeDeleteDialog}
        onConfirm={() => notePendingDelete && handleDelete(notePendingDelete.id)}
      />
      <UnlockNoteModal
        isOpen={Boolean(notePendingUnlock)}
        noteTitle={notePendingUnlock?.title || "Locked note"}
        password={unlockPassword}
        error={unlockError}
        isUnlocking={isUnlocking}
        isRecoveryMode={isRecoveryMode}
        accountPassword={accountPassword}
        newNotePassword={newNotePassword}
        isResetting={isResettingNotePassword}
        onChange={(event) => setUnlockPassword(event.target.value)}
        onAccountPasswordChange={(event) => setAccountPassword(event.target.value)}
        onNewNotePasswordChange={(event) => setNewNotePassword(event.target.value)}
        onToggleRecovery={() => {
          setIsRecoveryMode((current) => !current);
          setUnlockError("");
        }}
        onClose={closeUnlockModal}
        onSubmit={handleUnlockSubmit}
        onResetSubmit={handleResetNotePasswordSubmit}
      />
    </div>
  );
}
