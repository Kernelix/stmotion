import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useScrollProgress } from '@/hooks/useScrollProgress'

describe('useScrollProgress', () => {
  it('calculates progress based on document scroll', () => {
    const doc = document.documentElement

    Object.defineProperty(doc, 'scrollHeight', { value: 2000, configurable: true })
    Object.defineProperty(doc, 'clientHeight', { value: 1000, configurable: true })
    Object.defineProperty(doc, 'scrollTop', { value: 0, writable: true, configurable: true })

    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 0
    })

    const { result } = renderHook(() => useScrollProgress())

    expect(result.current).toBe(0)

    act(() => {
      doc.scrollTop = 500
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(0.5)

    raf.mockRestore()
  })
})
