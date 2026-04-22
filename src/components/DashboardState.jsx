export default function DashboardState({
  icon,
  title,
  description,
  tone = "neutral",
  action,
}) {
  const toneClasses =
    tone === "error"
      ? "border-rose-400/20 bg-rose-400/10 text-rose-100"
      : "border-white/10 bg-white/[0.04] text-textSecondary";

  return (
    <div
      className={`col-span-full rounded-[28px] border p-6 shadow-[0_14px_34px_rgba(0,0,0,0.14)] sm:p-8 ${toneClasses}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border overflow-hidden ${
              tone === "error"
                ? "border-rose-300/20 bg-rose-300/10 text-rose-200"
                : "border-white/10 bg-white/[0.04] text-textPrimary"
            }`}
          >
            {icon}
          </div>
          <div>
            <h3
              className={`text-lg font-semibold tracking-[-0.02em] ${
                tone === "error" ? "text-rose-100" : "text-textPrimary"
              }`}
            >
              {title}
            </h3>
            <p
              className={`mt-2 max-w-2xl text-sm leading-6 ${
                tone === "error" ? "text-rose-100/85" : "text-textSecondary"
              }`}
            >
              {description}
            </p>
          </div>
        </div>
        {action ? <div className="w-full sm:w-auto">{action}</div> : null}
      </div>
    </div>
  );
}
