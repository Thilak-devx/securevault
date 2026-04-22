import { Link } from "react-router-dom";
import SecureVaultLogo from "./SecureVaultLogo";

export default function AuthShell({
  title,
  subtitle,
  ctaLabel,
  ctaTo,
  ctaText,
  headerVisual = null,
  children,
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        {headerVisual ? (
          <div className="relative hidden min-h-[620px] overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(15,23,42,0.82))] p-10 shadow-[0_26px_90px_rgba(0,0,0,0.34)] lg:flex lg:flex-col lg:justify-between">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-transparent to-secondary/[0.08]" />
            <div className="relative">
              <SecureVaultLogo withWordmark />
            </div>
            <div className="relative flex flex-1 items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.12),transparent_58%)] blur-3xl" />
              <div className="max-w-sm">{headerVisual}</div>
            </div>
            <div className="relative max-w-md">
              <h1 className="text-[2.2rem] font-semibold tracking-[-0.04em] text-textPrimary">
                {title}
              </h1>
              <p className="mt-3 text-[15px] leading-7 text-textSecondary">
                {subtitle}
              </p>
            </div>
          </div>
        ) : null}
        <div className="relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.98),rgba(17,24,39,0.92))] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl transition-all duration-300 sm:p-9">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <div className="mb-8 sm:mb-10">
            <div className="mb-6 flex items-center justify-between">
              <SecureVaultLogo withWordmark wordmarkClassName="hidden sm:block" />
              {headerVisual ? (
                <div className="flex lg:hidden">{headerVisual}</div>
              ) : null}
            </div>
            <h1 className="max-w-sm text-[1.95rem] font-semibold tracking-[-0.03em] text-textPrimary sm:text-[2.15rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-sm text-[15px] leading-7 text-textSecondary">
              {subtitle}
            </p>
          </div>
          {children}
          <p className="mt-8 text-center text-sm text-textSecondary">
            {ctaText}{" "}
            <Link
              to={ctaTo}
              className="font-medium text-accent transition-all duration-300 hover:text-yellow-300"
            >
              {ctaLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
