export default function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`group relative block w-full overflow-hidden rounded-2xl bg-accent px-5 py-4 text-center text-[15px] font-semibold tracking-[0.01em] text-slate-950 shadow-lg shadow-yellow-500/20 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:brightness-[1.03] hover:shadow-glow active:scale-95 active:shadow-yellow-500/10 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:scale-100 ${className}`}
      {...props}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-white/25 via-transparent to-transparent opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100" />
      <span className="relative">{children}</span>
    </button>
  );
}
