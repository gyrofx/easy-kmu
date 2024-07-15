import { useCallback, useState } from 'react'

export function useDialog(): UseDialog {
  const [open, setOpen] = useState(false)
  return {
    isOpen: open,
    open: useCallback(() => setOpen(true), []),
    close: useCallback(() => setOpen(false), []),
  }
}

export interface UseDialog {
  isOpen: boolean
  open: () => void
  close: () => void
}
