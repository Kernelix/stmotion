import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useMediaQuery } from '@/hooks/useMediaQuery'

function setupMatchMedia(initialMatches) {
  let matches = initialMatches
  const listeners = new Set()

  const mql = {
    media: '(min-width: 900px)',
    matches,
    onchange: null,
    addEventListener: (_type, listener) => {
      listeners.add(listener)
    },
    removeEventListener: (_type, listener) => {
      listeners.delete(listener)
    },
    addListener: (listener) => {
      listeners.add(listener)
    },
    removeListener: (listener) => {
      listeners.delete(listener)
    },
    dispatchEvent: (event) => {
      listeners.forEach((listener) => listener(event))
      return true
    }
  }

  const setMatches = (next) => {
    matches = next
    mql.matches = next
    const event = { matches: next, media: mql.media }
    listeners.forEach((listener) => listener(event))
  }

  window.matchMedia = () => mql

  return { setMatches }
}

describe('useMediaQuery', () => {
  it('returns initial match state', () => {
    setupMatchMedia(true)
    const { result } = renderHook(() => useMediaQuery('(min-width: 900px)'))
    expect(result.current).toBe(true)
  })

  it('updates on media query change', () => {
    const { setMatches } = setupMatchMedia(false)
    const { result } = renderHook(() => useMediaQuery('(min-width: 900px)'))
    expect(result.current).toBe(false)

    act(() => {
      setMatches(true)
    })

    expect(result.current).toBe(true)
  })
})
