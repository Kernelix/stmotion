import { useEffect, useState } from 'react'

export function useModelAvailability(enabled, paths) {
  const [available, setAvailable] = useState(false)

  const isHtmlResponse = (response) => {
    const type = response.headers.get('content-type')?.toLowerCase() ?? ''
    return type.includes('text/html')
  }

  const isAvailableResponse = (response) => {
    if (response.ok) {
      return !isHtmlResponse(response)
    }
    // 304 comes from browser cache; treat as available.
    if (response.status === 304) {
      return true
    }
    return false
  }

  useEffect(() => {
    let active = true

    if (!enabled) {
      setAvailable(false)
      return () => {
        active = false
      }
    }

    const check = async () => {
      const results = await Promise.all(
        paths.map(async (path) => {
          try {
            const head = await fetch(path, { method: 'HEAD' })
            if (isAvailableResponse(head)) {
              return true
            }
          } catch {}
          try {
            const get = await fetch(path, { method: 'GET' })
            return isAvailableResponse(get)
          } catch {
            return false
          }
        })
      )
      if (active) {
        setAvailable(results.every(Boolean))
      }
    }

    check()

    return () => {
      active = false
    }
  }, [enabled, paths])

  return available
}
