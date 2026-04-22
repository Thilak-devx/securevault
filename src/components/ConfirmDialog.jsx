const secondaryButtonClassName =
  "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-textPrimary transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.99]";

const dangerButtonClassName =
  "rounded-2xl border border-rose-400/20 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300/30 hover:bg-rose-400/15 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  isLoading = false,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.98),rgba(17,24,39,0.92))] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.45)] sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-200">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M4 7h16" />
                <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
                <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
              </svg>
            </div>
            <div>
              <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-textPrimary">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-textSecondary">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onCancel} className={secondaryButtonClassName}>
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={dangerButtonClassName}
            >
              {isLoading ? "Deleting..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
