const categoryOptions = ["Personal", "Work", "Ideas", "Security", "Client"];

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3.5 text-[15px] text-textPrimary outline-none transition-all duration-200 ease-in-out placeholder:text-gray-400 hover:border-white/20 focus:border-yellow-400 focus:bg-slate-900 focus:ring-2 focus:ring-yellow-400/70 focus:shadow-[0_18px_40px_rgba(250,204,21,0.08)]";

const secondaryButtonClassName =
  "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-textPrimary transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.99]";

const primaryButtonClassName =
  "rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_10px_24px_rgba(250,204,21,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

export default function NoteModal({
  isOpen,
  mode,
  form,
  onChange,
  onClose,
  onSubmit,
  isSaving,
  error,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.98),rgba(17,24,39,0.92))] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.45)] sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                Secure Notes
              </p>
              <h2 className="mt-3 text-[1.7rem] font-semibold tracking-[-0.03em] text-textPrimary">
                {mode === "edit" ? "Edit note" : "Create new note"}
              </h2>
              <p className="mt-2 text-[13px] leading-5 text-textSecondary">
                Keep your notes organized with clear titles, concise content, and smart categorization.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 p-2 text-textSecondary transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:text-textPrimary"
            >
              x
            </button>
          </div>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
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
                rows={5}
                className={`${inputClassName} resize-none`}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2.5 block text-sm font-medium text-textSecondary">
                Category
              </span>
              <select
                name="tag"
                value={form.tag}
                onChange={onChange}
                className={inputClassName}
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <label className="flex items-center justify-between gap-4">
                <div>
                  <span className="block text-sm font-medium text-textPrimary">
                    Lock Note
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-textSecondary">
                    Protect this note with a separate password.
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
                    Note Password
                  </span>
                  <input
                    type="password"
                    name="notePassword"
                    value={form.notePassword}
                    onChange={onChange}
                    placeholder="Set a password for this note"
                    className={inputClassName}
                    required
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
              <button type="button" onClick={onClose} className={secondaryButtonClassName}>
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className={primaryButtonClassName}>
                {isSaving ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
