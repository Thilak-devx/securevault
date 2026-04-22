import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { deleteAccountRequest } from "../lib/accountApi";
import { getApiErrorMessage } from "../lib/apiError";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [error, setError] = useState("");

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  async function handleDeleteAccount() {
    try {
      setIsDeletingAccount(true);
      setError("");
      await deleteAccountRequest();
      logout();
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "We couldn't delete your account. Please try again.",
        ),
      );
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeletingAccount(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero-radial px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex max-w-7xl items-start gap-6 xl:gap-8">
        <Sidebar onLogout={handleLogout} userEmail={user?.email} />
        <main className="w-full">
          <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.9),rgba(15,23,42,0.76))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
            <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div className="max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
                Account Settings
              </p>
              <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.035em] text-textPrimary sm:text-[2.5rem]">
                Settings
              </h1>
              <p className="mt-3 text-[15px] leading-7 text-textSecondary">
                Manage your secure notes account, review your signed-in session, and control permanent account actions.
              </p>
            </div>

            <div className="mt-10 grid gap-6">
              <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-textPrimary">
                  Profile
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-textSecondary">
                      Email
                    </p>
                    <p className="mt-2 break-all text-sm text-textPrimary">
                      {user?.email || "No email available"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-textSecondary">
                      Session
                    </p>
                    <p className="mt-2 text-sm text-textPrimary">
                      Authenticated and protected with JWT
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-rose-400/15 bg-rose-400/[0.05] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-textPrimary">
                  Danger Zone
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-textSecondary">
                  Permanently remove your account and notes.
                </p>
                {error ? (
                  <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                  </div>
                ) : null}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-textSecondary">
                    This action cannot be undone.
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="rounded-2xl border border-rose-400/35 bg-[linear-gradient(135deg,rgba(244,63,94,0.24),rgba(190,24,93,0.28))] px-5 py-3 text-sm font-semibold text-rose-50 shadow-lg shadow-rose-950/30 transition-all duration-200 ease-in-out hover:scale-105 hover:border-rose-300/45 hover:brightness-105 active:scale-95"
                  >
                    Delete Account
                  </button>
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete your account?"
        description="This will permanently remove your profile and every note in your vault."
        confirmLabel="Delete Account"
        isLoading={isDeletingAccount}
        onCancel={() => !isDeletingAccount && setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
