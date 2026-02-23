import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks'

export function SitePreloader({ visible, progress = 0 }) {
  const reducedMotion = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(visible)
  const percent = Math.max(0, Math.min(100, Math.round(progress)))
  const ringRadius = 42
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference * (1 - percent / 100)
  const status =
    percent < 25
      ? 'Инициализация сцены'
      : percent < 60
        ? 'Загрузка ассетов'
        : percent < 95
          ? 'Сборка визуала'
          : 'Финальный штрих'

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
      className={`site-preloader fixed inset-0 z-[90] flex items-center justify-center transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      <div className="site-preloader-bg" />
      <div className="site-preloader-noise" />
      <div className="site-preloader-shell">
        <div className="site-preloader-ring-wrap" aria-hidden>
          <div className="site-preloader-ring-glow" />
          <svg className="site-preloader-ring" viewBox="0 0 120 120">
            <circle className="site-preloader-ring-track" cx="60" cy="60" r={ringRadius} />
            <circle
              className="site-preloader-ring-progress"
              cx="60"
              cy="60"
              r={ringRadius}
              style={{
                strokeDasharray: ringCircumference,
                strokeDashoffset: ringOffset
              }}
            />
          </svg>
          <div className="site-preloader-percent" aria-live="polite">
            {String(percent).padStart(2, '0')}%
          </div>
        </div>
        <div className="site-preloader-copy">
          <div className="site-preloader-title">ST Celestial</div>
          <div className="site-preloader-status">{status}</div>
          <div className="site-preloader-track">
            <div className="site-preloader-fill" style={{ width: `${percent}%` }}>
              {!reducedMotion ? <span className="site-preloader-sheen" /> : null}
            </div>
          </div>
          <div className="site-preloader-meta">3D scene • models • shaders</div>
        </div>
      </div>
    </div>
  )
}
