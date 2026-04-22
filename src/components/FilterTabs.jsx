const tabs = ["All", "Pinned", "Bookmarked"];

export default function FilterTabs({ activeTab, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-2.5">
      {tabs.map((tab) => {
        const active = activeTab === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`group relative overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400/60 ${
              active
                ? "bg-[linear-gradient(135deg,rgba(250,204,21,1),rgba(245,176,34,0.95))] text-slate-950 shadow-[0_12px_28px_rgba(250,204,21,0.2)] hover:scale-[1.02] hover:brightness-[1.02]"
                : "border border-white/10 bg-white/[0.04] text-textSecondary hover:scale-[1.02] hover:border-white/20 hover:bg-white/[0.07] hover:text-textPrimary hover:brightness-110 active:scale-[0.95]"
            }`}
          >
            <span
              className={`absolute inset-0 rounded-full transition-all duration-200 ease-in-out ${
                active
                  ? "scale-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_65%)]"
                  : "scale-75 bg-white/[0.08] opacity-0 group-hover:scale-100 group-hover:opacity-100"
              }`}
            />
            <span className="relative">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
