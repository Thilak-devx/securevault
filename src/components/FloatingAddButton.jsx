export default function FloatingAddButton({ onClick }) {
  return (
    <div className="group fixed bottom-8 right-8 z-20">
      <div className="pointer-events-none absolute -top-11 right-0 rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.94),rgba(17,24,39,0.86))] px-3 py-1.5 text-xs font-medium tracking-[0.08em] text-textPrimary shadow-lg opacity-0 transition-all duration-200 ease-in-out group-hover:-translate-y-1 group-hover:opacity-100">
        Add Note
      </div>
      <button
        type="button"
        aria-label="Add note"
        onClick={onClick}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl font-light text-slate-950 shadow-xl shadow-yellow-500/25 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-glow active:scale-95"
      >
        +
      </button>
    </div>
  );
}
