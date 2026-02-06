import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

describe('useDebouncedValue', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces updates by delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 400), {
      initialProps: { value: 'alpha' }
    })

    expect(result.current).toBe('alpha')

    rerender({ value: 'beta' })
    expect(result.current).toBe('alpha')

    act(() => {
      vi.advanceTimersByTime(401)
    })

    expect(result.current).toBe('beta')
  })
})
