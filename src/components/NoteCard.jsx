import { useEffect, useRef, useState } from "react";

const actionClasses =
  "rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-textSecondary shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:border-white/20 hover:bg-white/[0.05] hover:text-textPrimary active:scale-95";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderHighlightedText(text, query) {
  if (!query.trim()) {
    return text;
  }

  const pattern = new RegExp(`(${escapeRegExp(query)})`, "ig");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <mark
          key={`${part}-${index}`}
          className="rounded bg-accent/20 px-1 text-accent"
        >
          {part}
        </mark>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export default function NoteCard({
  title,
  content,
  category,
  time,
  createdAt,
  updatedAt,
  tag,
  pinned,
  isLocked,
  isNew,
  searchQuery,
  onTogglePin,
  onEdit,
  onDelete,
  onOpen,
  isPinning,
  isDeleting,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuId = `note-menu-${title.toLowerCase().replace(/\s+/g, "-")}`;

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  function handleMenuAction(action) {
    setMenuOpen(false);
    action();
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className={`group relative cursor-pointer overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(17,24,39,0.98),rgba(17,24,39,0.9))] p-5 text-left shadow-md transition-all duration-200 ease-in-out hover:-translate-y-1 hover:scale-[1.012] hover:border-white/[0.14] hover:shadow-[0_24px_64px_rgba(250,204,21,0.08)] active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-yellow-400/60 ${
        isLocked ? "opacity-[0.92] hover:shadow-[0_24px_64px_rgba(250,204,21,0.12)]" : ""
      } ${isNew ? "animate-[noteCreateIn_700ms_cubic-bezier(0.22,1,0.36,1)]" : ""}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.035] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.025] via-transparent to-secondary/[0.04] opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100" />
      {isLocked ? (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(250,204,21,0.02),rgba(15,23,42,0.12))]" />
      ) : null}
      {isLocked ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-accent/20 bg-[linear-gradient(180deg,rgba(17,24,39,0.94),rgba(17,24,39,0.86))] px-3 py-1.5 text-[11px] font-medium tracking-[0.08em] text-accent shadow-lg opacity-0 transition-all duration-200 ease-in-out group-hover:-translate-x-1/2 group-hover:translate-y-1 group-hover:opacity-100">
          Unlock note
        </div>
      ) : null}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {!isLocked ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-secondary uppercase">
                {tag}
              </span>
            </div>
          ) : null}
          <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-textPrimary">
            {renderHighlightedText(title, searchQuery)}
          </h3>
        </div>
        <div className="flex items-start gap-2">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
            aria-label="More actions"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-controls={menuId}
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((current) => !current);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-textSecondary shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:border-white/20 hover:bg-white/[0.06] hover:text-textPrimary active:scale-95"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5.5h.01" />
              <path d="M12 12h.01" />
              <path d="M12 18.5h.01" />
            </svg>
          </button>
          <div
            id={menuId}
            role="menu"
            aria-hidden={!menuOpen}
            onClick={(event) => event.stopPropagation()}
            className={`absolute right-0 top-12 z-20 w-44 origin-top-right rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.82),rgba(17,24,39,0.74))] p-2 shadow-lg backdrop-blur-md transition-all duration-200 ease-in-out ${
              menuOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-2 scale-[0.96] opacity-0"
            }`}
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => handleMenuAction(onEdit)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-textPrimary transition-all duration-200 ease-in-out hover:scale-[1.01] hover:bg-white/[0.08] hover:pl-3.5"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-textSecondary"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="m12 20 9-9-8-8-9 9-1 9 9-1Z" />
                <path d="m16 7 1 1" />
              </svg>
              Edit Note
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleMenuAction(onTogglePin)}
              disabled={isPinning}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-textPrimary transition-all duration-200 ease-in-out hover:scale-[1.01] hover:bg-white/[0.08] hover:pl-3.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-textSecondary"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M7 4h10v16l-5-3-5 3V4Z" />
              </svg>
              {isPinning ? "Saving..." : pinned ? "Unpin Note" : "Pin Note"}
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleMenuAction(onDelete)}
              disabled={isDeleting}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-200 transition-all duration-200 ease-in-out hover:scale-[1.01] hover:bg-rose-400/10 hover:pl-3.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="m19 6-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
              </svg>
              {isDeleting ? "Deleting..." : "Delete Note"}
            </button>
          </div>
          </div>
        </div>
      </div>
      {isLocked ? (
        <div className="pointer-events-none absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(17,24,39,0.84))] text-accent shadow-lg sm:right-6 sm:top-6">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8.25 10V8.75a3.75 3.75 0 1 1 7.5 0V10" />
            <rect x="5.75" y="10" width="12.5" height="10.5" rx="2.5" />
            <circle cx="12" cy="15.25" r="1.15" fill="currentColor" stroke="none" />
            <path d="M12 16.4v1.85" />
          </svg>
        </div>
      ) : null}
      {isLocked ? (
        <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded-full bg-white/[0.08] blur-[1px]" />
            <div className="h-3.5 w-[88%] rounded-full bg-white/[0.08] blur-[1px]" />
            <div className="h-3.5 w-[72%] rounded-full bg-white/[0.08] blur-[1px]" />
          </div>
          <p className="mt-4 text-sm font-semibold text-textPrimary">
            🔒 Locked Note
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-accent">
            <span aria-hidden="true">🔒</span>
            <span>Click to unlock</span>
          </p>
        </div>
      ) : (
        <p className="line-clamp-3 overflow-hidden text-sm leading-[1.65rem] text-textSecondary">
          {renderHighlightedText(content, searchQuery)}
        </p>
      )}
      {!isLocked ? (
        <div className="pointer-events-none absolute inset-x-5 bottom-[4.85rem] z-10 hidden translate-y-2 items-center justify-end gap-2 opacity-0 transition-all duration-200 ease-in-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            className="pointer-events-auto rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-textPrimary shadow-lg backdrop-blur-md transition-all duration-200 ease-in-out hover:border-white/20 hover:bg-white/[0.08]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            className="pointer-events-auto rounded-full border border-rose-400/20 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-rose-200 shadow-lg backdrop-blur-md transition-all duration-200 ease-in-out hover:bg-rose-400/10"
          >
            Delete
          </button>
        </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            {category && category !== "All" ? (
              <span className="rounded-full border border-accent/10 bg-accent/[0.08] px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-accent uppercase">
                {category}
              </span>
            ) : null}
            <span className="text-xs text-textSecondary">{time}</span>
          </div>
          {!isLocked ? (
            <div className="flex flex-col gap-0.5 text-[11px] text-textSecondary">
              <span>{createdAt}</span>
              <span>{updatedAt}</span>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {pinned ? (
            <span className={`${actionClasses} border-accent/20 bg-accent/[0.08] text-accent`}>
              Pinned
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
