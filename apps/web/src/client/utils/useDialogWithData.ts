import { useState } from 'react'
import { useDialog } from './useDialog'

export function useDialogWithData<T>(): UseDialogWithData<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const { isOpen, close, open } = useDialog()

  return {
    isOpen,
    data,
    close,
    open(dataForDialog: T) {
      setData(dataForDialog)
      open()
    },
  } as UseDialogWithData<T>
}

export type UseDialogWithData<T> = UseDialogWithDataSet<T> | UseDialogWithDataUnset<T>

export interface UseDialogWithDataSet<T> {
  data: T
  isOpen: true
  open: (data: T) => void
  close: () => void
}

export interface UseDialogWithDataUnset<T> {
  data: undefined
  isOpen: false
  open: (data: T) => void
  close: () => void
}
