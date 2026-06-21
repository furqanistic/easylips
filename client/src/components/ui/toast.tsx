import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ToastContext, type Toast, type ToastInput } from './toast-context'
const TOAST_TIMEOUT = 4_000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback((input: ToastInput) => {
    const id = crypto.randomUUID()
    setToasts((current) => [
      ...current,
      {
        id,
        title: input.title,
        description: input.description,
        variant: input.variant ?? 'info',
      },
    ])
  }, [])

  const value = useMemo(() => ({ toast, dismiss }), [dismiss, toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport dismiss={dismiss} toasts={toasts} />
    </ToastContext.Provider>
  )
}

function ToastViewport({
  dismiss,
  toasts,
}: {
  dismiss: (id: string) => void
  toasts: Toast[]
}) {
  return (
    <div
      aria-live="polite"
      className="fixed right-4 top-4 z-[1000] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6"
    >
      {toasts.map((toast) => (
        <ToastItem dismiss={dismiss} key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

function ToastItem({
  dismiss,
  toast,
}: {
  dismiss: (id: string) => void
  toast: Toast
}) {
  useEffect(() => {
    const timeout = window.setTimeout(() => dismiss(toast.id), TOAST_TIMEOUT)
    return () => window.clearTimeout(timeout)
  }, [dismiss, toast.id])

  const variantClass =
    toast.variant === 'success'
      ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-50'
      : toast.variant === 'error'
        ? 'border-destructive/40 bg-destructive/10 text-red-50'
        : 'border-white/15 bg-white/[0.08] text-white'

  return (
    <div
      className={`rounded-lg border px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl ${variantClass}`}
      role={toast.variant === 'error' ? 'alert' : 'status'}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-5">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-sm leading-5 text-white/70">{toast.description}</p>
          ) : null}
        </div>
        <button
          aria-label="Dismiss notification"
          className="grid size-6 shrink-0 place-items-center rounded-md text-white/60 transition hover:bg-white/10 hover:text-white"
          onClick={() => dismiss(toast.id)}
          type="button"
        >
          x
        </button>
      </div>
    </div>
  )
}
