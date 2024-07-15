import { renderHook, act } from '@testing-library/react'
import { useDialogWithData } from './useDialogWithData'

describe('useDialogWithData', () => {
  it('is closed and the data is undefined by default', () => {
    const { result } = renderHook(() => useDialogWithData<string>())

    expect(result.current.data).toBeUndefined()
    expect(result.current.isOpen).toBe(false)
  })

  it('opens the dialog', () => {
    const { result } = renderHook(() => useDialogWithData<string>())

    act(() => void result.current.open('test'))

    expect(result.current.data).toBe('test')
    expect(result.current.isOpen).toBe(true)
  })

  it('closes the dialog', () => {
    const { result } = renderHook(() => useDialogWithData<string>())

    act(() => void result.current.open('test'))
    act(() => void result.current.close())

    expect(result.current.data).toBe('test')
    expect(result.current.isOpen).toBe(false)
  })

  it('overwrites the value when the dialog is opened twice', () => {
    const { result } = renderHook(() => useDialogWithData<string>())

    act(() => void result.current.open('test'))
    act(() => void result.current.open('test2'))

    expect(result.current.data).toBe('test2')
    expect(result.current.isOpen).toBe(true)
  })

  it('can close the dialog even when it is closed already', () => {
    const { result } = renderHook(() => useDialogWithData<string>())

    act(() => void result.current.close())

    expect(result.current.data).toBeUndefined()
    expect(result.current.isOpen).toBe(false)
  })

  it('assigns the correct typings depending on the state (opened or closed)', () => {
    const { result } = renderHook(() => useDialogWithData<string>())

    const current = result.current
    if (!current.isOpen) assertIsUndefined(current.data)
    if (current.isOpen) assertIsString(current.data)

    expect(true).toBe(true)

    function assertIsUndefined(_value: undefined) {}
    function assertIsString(_value: string) {}
  })
})
