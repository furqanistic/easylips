import { createContext, useContext } from 'react'

export type ToastVariant = 'success' | 'error' | 'info'

export type Toast = {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

export type ToastInput = Omit<Toast, 'id' | 'variant'> & {
  variant?: ToastVariant
}

export type ToastContextValue = {
  toast: (input: ToastInput) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
