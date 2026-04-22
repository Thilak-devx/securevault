import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

let nextToastId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) =>
      currentToasts.map((toast) =>
        toast.id === toastId ? { ...toast, visible: false } : toast,
      ),
    );

    window.setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== toastId),
      );
    }, 220);
  }, []);

  const showToast = useCallback(
    ({ title, description = "", tone = "success", duration = 2600 }) => {
      const toastId = nextToastId += 1;
      const toast = {
        id: toastId,
        title,
        description,
        tone,
        visible: true,
      };

      setToasts((currentToasts) => [...currentToasts, toast]);

      window.setTimeout(() => {
        dismissToast(toastId);
      }, duration);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast, toasts],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
