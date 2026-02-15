import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks'

export function SitePreloader({ visible }) {
  const reducedMotion = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(visible)

  useEffect(() => {
    let timeoutId = null
    if (visible) {
      setMounted(true)
      return undefined
    }
    timeoutId = window.setTimeout(() => {
      setMounted(false)
    }, reducedMotion ? 0 : 280)
    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [reducedMotion, visible])

  useEffect(() => {
    if (!visible) {
      return undefined
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [visible])

  if (!mounted) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-paper-50/96 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[rgb(var(--accent))]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-ink-900/70 [animation-delay:120ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-[rgb(var(--accent))] [animation-delay:240ms]" />
        </div>
        <div className="text-xs uppercase tracking-[0.34em] text-ink-500">ST Celestial</div>
      </div>
    </div>
  )
}
