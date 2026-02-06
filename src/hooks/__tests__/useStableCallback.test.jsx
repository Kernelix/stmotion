import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useStableCallback } from '@/hooks/useStableCallback'

describe('useStableCallback', () => {
  it('keeps stable function identity across renders', () => {
    const { result, rerender } = renderHook(({ value }) => {
      const handler = useStableCallback((input) => value + input)
      return handler
    }, { initialProps: { value: 1 } })

    const first = result.current
    rerender({ value: 2 })
    expect(result.current).toBe(first)
  })
})
