export default function NoteCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(17,24,39,0.98),rgba(17,24,39,0.9))] p-5 shadow-md sm:p-6">
      <div className="animate-pulse">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-6 w-20 rounded-full bg-white/[0.08]" />
            <div className="mt-3 h-6 w-3/4 rounded-full bg-white/[0.08]" />
          </div>
          <div className="h-10 w-10 rounded-full bg-white/[0.08]" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded-full bg-white/[0.08]" />
          <div className="h-4 w-[92%] rounded-full bg-white/[0.08]" />
          <div className="h-4 w-[80%] rounded-full bg-white/[0.08]" />
        </div>
        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-24 rounded-full bg-white/[0.08]" />
            <div className="h-4 w-16 rounded-full bg-white/[0.08]" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3.5 w-28 rounded-full bg-white/[0.08]" />
            <div className="h-3.5 w-32 rounded-full bg-white/[0.08]" />
          </div>
        </div>
      </div>
    </div>
  );
}
