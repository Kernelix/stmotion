import { useEffect, useState } from 'react'

export function useMediaQuery(query, defaultState = false) {
  const getMatch = () => {
    if (typeof window === 'undefined') {
      return defaultState
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState(getMatch)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = (event) => {
      setMatches(event.matches)
    }
    setMatches(mediaQuery.matches)
    mediaQuery.addEventListener('change', handler)
    return () => {
      mediaQuery.removeEventListener('change', handler)
    }
  }, [query])

  return matches
}
