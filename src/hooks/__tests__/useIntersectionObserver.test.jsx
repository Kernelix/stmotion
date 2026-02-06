import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

describe('useIntersectionObserver', () => {
  it('returns intersection state for an element', () => {
    const element = document.createElement('div')
    const ref = { current: element }
    const { result } = renderHook(() => useIntersectionObserver(ref))
    expect(result.current?.isIntersecting).toBe(false)
  })
})
