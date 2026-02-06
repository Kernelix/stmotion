import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useEventListener } from '@/hooks/useEventListener'

describe('useEventListener', () => {
  it('subscribes and cleans up event listener', () => {
    const handler = vi.fn()
    const target = document.createElement('button')

    const { unmount } = renderHook(() => useEventListener(target, 'click', handler))

    act(() => {
      target.click()
    })

    expect(handler).toHaveBeenCalledTimes(1)

    unmount()

    act(() => {
      target.click()
    })

    expect(handler).toHaveBeenCalledTimes(1)
  })
})
