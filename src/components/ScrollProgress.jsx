import { usePrefersReducedMotion, useScrollProgress } from '@/hooks'

export function ScrollProgress() {
  const progress = useScrollProgress()
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) {
    return null
  }

  return (
    <div className="fixed left-0 top-0 z-50 h-0.5 w-full bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-accent-400 via-accent-500 to-accent-300 transition-[width] duration-200"
        style={{ width: `${Math.min(progress * 100, 100)}%` }}
      />
    </div>
  )
}
