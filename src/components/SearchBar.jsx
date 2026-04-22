export default function SearchBar({ value, onChange, onClear }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.94),rgba(17,24,39,0.86))] px-4 py-3 shadow-lg transition-all duration-200 ease-in-out hover:border-white/20 hover:shadow-xl focus-within:border-yellow-400/60 focus-within:ring-2 focus-within:ring-yellow-400/60 focus-within:shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-textSecondary"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        placeholder="Search notes"
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-[15px] text-textPrimary outline-none placeholder:text-gray-400"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-medium text-textSecondary shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:border-white/20 hover:bg-white/[0.05] hover:text-textPrimary active:scale-95"
        >
          Clear
        </button>
      ) : null}
    </label>
  );
}
