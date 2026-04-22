import { useEffect, useState } from "react";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3.5 text-[15px] text-textPrimary outline-none transition-all duration-200 ease-in-out placeholder:text-gray-400 hover:border-white/20 focus:border-yellow-400 focus:bg-slate-900 focus:ring-2 focus:ring-yellow-400/70 focus:shadow-[0_18px_40px_rgba(250,204,21,0.08)]";

export default function UnlockNoteModal({
  isOpen,
  noteTitle,
  password,
  error,
  isUnlocking,
  isRecoveryMode,
  accountPassword,
  newNotePassword,
  isResetting,
  onChange,
  onAccountPasswordChange,
  onNewNotePasswordChange,
  onToggleRecovery,
  onClose,
  onSubmit,
  onResetSubmit,
}) {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setShouldRender(false), 220);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center p-4 transition-all duration-200 ease-in-out sm:items-center ${
        visible ? "bg-slate-950/70 backdrop-blur-sm" : "bg-slate-950/0"
      }`}
    >
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.98),rgba(17,24,39,0.92))] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.45)] transition-all duration-200 ease-in-out sm:p-7 ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                Locked Note
              </p>
              <h2 className="mt-3 text-[1.55rem] font-semibold tracking-[-0.03em] text-textPrimary">
                Unlock "{noteTitle}"
              </h2>
              <p className="mt-2 text-[13px] leading-5 text-textSecondary">
                {isRecoveryMode
                  ? "Verify your account to reset this note password."
                  : "Enter the note password to view this protected content."}
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

          <form
            className="mt-7 space-y-4"
            onSubmit={isRecoveryMode ? onResetSubmit : onSubmit}
          >
            {isRecoveryMode ? (
              <>
                <label className="block">
                  <span className="mb-2.5 block text-sm font-medium text-textSecondary">
                    Account Password
                  </span>
                  <input
                    type="password"
                    value={accountPassword}
                    onChange={onAccountPasswordChange}
                    placeholder="Enter your account password"
                    className={inputClassName}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-2.5 block text-sm font-medium text-textSecondary">
                    New Note Password
                  </span>
                  <input
                    type="password"
                    value={newNotePassword}
                    onChange={onNewNotePasswordChange}
                    placeholder="Set a new password for this note"
                    className={inputClassName}
                    required
                  />
                </label>
              </>
            ) : (
              <label className="block">
                <span className="mb-2.5 block text-sm font-medium text-textSecondary">
                  Password
                </span>
                <input
                  type="password"
                  name="unlock-password"
                  value={password}
                  onChange={onChange}
                  placeholder="Enter note password"
                  className={`${inputClassName} ${
                    error
                      ? "border-rose-400/70 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/50 motion-safe:animate-[shake_0.28s_ease-in-out]"
                      : ""
                  }`}
                  required
                />
              </label>
            )}

            {error ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={onToggleRecovery}
              className="text-xs font-medium text-accent transition-all duration-200 ease-in-out hover:text-yellow-300"
            >
              {isRecoveryMode ? "Use note password instead" : "Reset with account password"}
            </button>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-textPrimary shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:border-white/20 hover:bg-white/[0.06] active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRecoveryMode ? isResetting : isUnlocking}
                className="rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-yellow-500/20 transition-all duration-200 ease-in-out hover:scale-105 hover:brightness-[1.03] hover:shadow-glow active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                <span className="flex items-center justify-center gap-2.5">
                  {(isRecoveryMode ? isResetting : isUnlocking) ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        className="opacity-25"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : null}
                  <span>
                    {isRecoveryMode
                      ? isResetting
                        ? "Resetting..."
                        : "Reset Password"
                      : isUnlocking
                        ? "Unlocking..."
                        : "Unlock"}
                  </span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
