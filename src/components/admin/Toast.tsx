"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastKind = "success" | "error";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  showToast: (kind: ToastKind, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (kind: ToastKind, message: string) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, kind, message }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 ${
              t.kind === "success"
                ? "bg-emerald-950/90 border-emerald-800 text-emerald-100"
                : "bg-red-950/90 border-red-800 text-red-100"
            }`}
          >
            {t.kind === "success" ? (
              <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <XCircle size={20} className="shrink-0 mt-0.5 text-red-400" />
            )}
            <p className="text-sm leading-snug flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-white/50 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
