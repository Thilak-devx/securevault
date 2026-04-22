import { useEffect, useState } from "react";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3.5 text-[15px] text-textPrimary outline-none transition-all duration-200 ease-in-out placeholder:text-gray-400 hover:border-white/20 focus:border-yellow-400 focus:bg-slate-900 focus:ring-2 focus:ring-yellow-400/70 focus:shadow-[0_18px_40px_rgba(250,204,21,0.08)]";

const secondaryButtonClassName =
  "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-textPrimary shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:border-white/20 hover:bg-white/[0.06] active:scale-95";

const primaryButtonClassName =
  "rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-yellow-500/20 transition-all duration-200 ease-in-out hover:scale-105 hover:brightness-[1.03] hover:shadow-glow active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100";

export default function NoteDetailModal({
  isOpen,
  note,
  form,
  isEditing,
  onChange,
  onClose,
  onToggleEdit,
  onSubmit,
  isSaving,
  error,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => setVisible(true));

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !note) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center p-4 transition-all duration-200 ease-in-out sm:items-center ${
        visible ? "bg-slate-950/70 backdrop-blur-sm" : "bg-slate-950/0"
      }`}
    >
      <div
        className={`relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.98),rgba(17,24,39,0.92))] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.45)] transition-all duration-200 ease-in-out sm:p-7 ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[1.7rem] font-semibold tracking-[-0.03em] text-textPrimary">
                {isEditing ? "Edit note" : note.title}
              </h2>
              <p className="mt-2 text-[13px] leading-5 text-textSecondary">
                Full note details and quick editing.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 p-2 text-textSecondary transition-all duration-200 ease-in-out hover:scale-105 hover:border-white/20 hover:bg-white/[0.05] hover:text-textPrimary active:scale-95"
            >
              x
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-secondary uppercase">
              {note.tag}
            </span>
            {note.category && note.category !== "All" ? (
              <span className="rounded-full border border-accent/10 bg-accent/[0.08] px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-accent uppercase">
                {note.category}
              </span>
            ) : null}
            {note.pinned ? (
              <span className="rounded-full border border-accent/20 bg-accent/[0.08] px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-accent uppercase">
                Pinned
              </span>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-sm text-textSecondary sm:grid-cols-2">
            <div>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-textSecondary/80">
                Created
              </span>
              <span className="mt-1 block text-textPrimary">{note.createdAt}</span>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-textSecondary/80">
                Updated
              </span>
              <span className="mt-1 block text-textPrimary">{note.updatedAt}</span>
            </div>
          </div>

          {isEditing ? (
            <form className="mt-6 space-y-5" onSubmit={onSubmit}>
              <label className="block">
                <span className="mb-2.5 block text-sm font-medium text-textSecondary">
                  Title
                </span>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Enter note title"
                  className={inputClassName}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2.5 block text-sm font-medium text-textSecondary">
                  Content
                </span>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={onChange}
                  placeholder="Write your note"
                  rows={8}
                  className={`${inputClassName} resize-none`}
                  required
                />
              </label>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <label className="flex items-center justify-between gap-4">
                  <div>
                    <span className="block text-sm font-medium text-textPrimary">
                      Lock Note
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-textSecondary">
                      Keep this note behind its own password.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    name="isLocked"
                    checked={Boolean(form.isLocked)}
                    onChange={onChange}
                    className="h-5 w-5 rounded border-white/20 bg-slate-900 text-accent focus:ring-accent/50"
                  />
                </label>

                {form.isLocked ? (
                  <label className="mt-4 block">
                    <span className="mb-2.5 block text-sm font-medium text-textSecondary">
                      {note.isLocked ? "New Note Password" : "Note Password"}
                    </span>
                    <input
                      type="password"
                      name="notePassword"
                      value={form.notePassword}
                      onChange={onChange}
                      placeholder={
                        note.isLocked
                          ? "Leave blank to keep the current password"
                          : "Set a password for this note"
                      }
                      className={inputClassName}
                      required={!note.isLocked}
                    />
                  </label>
                ) : null}
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onToggleEdit}
                  className={secondaryButtonClassName}
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className={primaryButtonClassName}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6">
              <div className="rounded-[28px] border border-white/10 bg-slate-950/50 p-5">
                <p className="whitespace-pre-wrap text-[15px] leading-7 text-textPrimary">
                  {note.content}
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={onClose} className={secondaryButtonClassName}>
                  Close
                </button>
                <button
                  type="button"
                  onClick={onToggleEdit}
                  className={primaryButtonClassName}
                >
                  Edit Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
