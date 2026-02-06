import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

describe('usePrefersReducedMotion', () => {
  it('reflects prefers-reduced-motion media query', () => {
    window.matchMedia = () =>
      ({
        media: '(prefers-reduced-motion: reduce)',
        matches: true,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true
      })

    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })
})
