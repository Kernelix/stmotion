import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLocalStorageState } from '@/hooks/useLocalStorageState'

describe('useLocalStorageState', () => {
  it('persists state to localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState('key', 'initial'))
    expect(result.current[0]).toBe('initial')

    act(() => {
      result.current[1]('next')
    })

    expect(window.localStorage.getItem('key')).toBe('next')
  })
})
