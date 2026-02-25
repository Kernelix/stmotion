import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks'

export function SitePreloader({ visible, progress = 0 }) {
  const reducedMotion = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(visible)
  const percent = Math.max(0, Math.min(100, progress))
  const [displayPercent, setDisplayPercent] = useState(percent)
  const maxVisiblePercentRef = useRef(percent)
  const prevVisibleRef = useRef(visible)
  const ringRadius = 42
  const ringCircumference = 2 * Math.PI * ringRadius
  const roundedDisplayPercent = Math.max(0, Math.min(100, Math.round(displayPercent)))
  const status =
    roundedDisplayPercent < 30
      ? 'Инициализация сцены'
      : roundedDisplayPercent < 70
        ? 'Загрузка ассетов'
        : roundedDisplayPercent < 95
          ? 'Сборка визуала'
          : roundedDisplayPercent < 100
            ? 'Почти готово'
            : 'Финальный штрих'
  const displayRingOffset = ringCircumference * (1 - displayPercent / 100)

  useEffect(() => {
    if (visible && !prevVisibleRef.current) {
      maxVisiblePercentRef.current = percent
      setDisplayPercent(percent)
    }
    prevVisibleRef.current = visible
  }, [percent, visible])

  useEffect(() => {
    if (visible) {
      maxVisiblePercentRef.current = Math.max(maxVisiblePercentRef.current, percent)
      setDisplayPercent(maxVisiblePercentRef.current)
      return
    }
    maxVisiblePercentRef.current = 100
    setDisplayPercent(100)
  }, [percent, visible])

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
      className={`site-preloader fixed inset-0 z-[90] flex items-center justify-center transition-opacity duration-300 ease-out ${
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
                strokeDashoffset: displayRingOffset,
                transition: reducedMotion ? 'none' : 'stroke-dashoffset 260ms cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            />
          </svg>
          <div className="site-preloader-percent" aria-live="polite">
            {String(roundedDisplayPercent).padStart(2, '0')}%
          </div>
        </div>
        <div className="site-preloader-copy">
          <div className="site-preloader-title">ST Celestial</div>
          <div className="site-preloader-status">{status}</div>
          <div className="site-preloader-track">
            <div
              className="site-preloader-fill"
              style={{
                width: `${displayPercent}%`,
                transition: reducedMotion ? 'none' : 'width 260ms cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              {!reducedMotion ? <span className="site-preloader-sheen" /> : null}
            </div>
          </div>
          <div className="site-preloader-meta">3D scene • models • shaders</div>
        </div>
      </div>
    </div>
  )
}
