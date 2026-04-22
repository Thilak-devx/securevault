import { useToast } from "../context/ToastContext";

const toneClasses = {
  success:
    "border-emerald-400/20 bg-[linear-gradient(180deg,rgba(6,78,59,0.96),rgba(6,95,70,0.88))] text-emerald-50",
  error:
    "border-rose-400/20 bg-[linear-gradient(180deg,rgba(76,5,25,0.96),rgba(127,29,29,0.88))] text-rose-50",
};

export default function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-full max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-[24px] border px-4 py-3 shadow-xl backdrop-blur-xl transition-all duration-200 ease-in-out ${
            toneClasses[toast.tone] ?? toneClasses.success
          } ${
            toast.visible
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-2 scale-95 opacity-0"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-xs leading-5 text-current/80">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded-full p-1 text-current/70 transition-all duration-200 ease-in-out hover:bg-white/10 hover:text-current active:scale-95"
            >
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
