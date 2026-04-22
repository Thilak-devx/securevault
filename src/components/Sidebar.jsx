import { NavLink } from "react-router-dom";
import SecureVaultLogo from "./SecureVaultLogo";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Settings", to: "/settings" },
];

export default function Sidebar({ onLogout, userEmail }) {
  return (
    <aside className="hidden w-72 flex-col rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.96),rgba(17,24,39,0.86))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl lg:flex">
      <div className="mb-10">
        <SecureVaultLogo withWordmark />
      </div>
      <nav className="space-y-3.5">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `group relative flex w-full items-center overflow-hidden rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 ease-in-out ${
                item.badge ? "justify-between" : "justify-start"
              } ${
                isActive
                  ? "bg-[linear-gradient(135deg,rgba(250,204,21,1),rgba(245,176,34,0.94))] text-slate-950 shadow-[0_16px_38px_rgba(250,204,21,0.2)] hover:scale-[1.015] hover:brightness-[1.02]"
                  : "text-textSecondary hover:translate-x-1 hover:scale-[1.015] hover:bg-white/[0.05] hover:text-textPrimary hover:brightness-110 active:translate-x-0.5 active:scale-[0.98]"
              }`
            }
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100"
              aria-hidden="true"
            />
            <span>{item.label}</span>
            {item.badge ? (
              <span className="text-xs transition-transform duration-300 group-hover:translate-x-0.5">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>
      <div className="mt-10 border-t border-gray-700/30 pt-7" />
      <div className="mt-auto rounded-[26px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.14)]">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-textSecondary">Account</p>
        <p className="mt-2.5 break-all text-sm leading-6 text-textPrimary">
          {userEmail || "Secure session active"}
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-textPrimary shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:border-white/20 hover:bg-white/[0.07] active:scale-95"
        >
          Log Out
        </button>
      </div>
    </aside>
  );
}
