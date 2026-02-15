import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks'

const interactiveSelector = 'a, button, [role="button"], [data-cursor="interactive"]'

export function CustomCursor() {
  const reducedMotion = usePrefersReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const rafRef = useRef(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion) {
      setEnabled(false)
      return undefined
    }

    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const apply = () => {
      setEnabled(media.matches)
    }

    apply()
    media.addEventListener('change', apply)
    return () => {
      media.removeEventListener('change', apply)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('cursor-active')
      return undefined
    }
    document.body.classList.add('cursor-active')
    return () => {
      document.body.classList.remove('cursor-active')
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current) {
      return undefined
    }

    const dotNode = dotRef.current
    const ringNode = ringRef.current

    const setInteractive = (value) => {
      dotNode.classList.toggle('is-interactive', value)
      ringNode.classList.toggle('is-interactive', value)
    }

    const setPressed = (value) => {
      dotNode.classList.toggle('is-pressed', value)
      ringNode.classList.toggle('is-pressed', value)
    }

    const setVisible = (value) => {
      dotNode.classList.toggle('is-visible', value)
      ringNode.classList.toggle('is-visible', value)
    }

    const onMove = (event) => {
      targetRef.current.x = event.clientX
      targetRef.current.y = event.clientY
      if (!dotNode.classList.contains('is-visible')) {
        currentRef.current.x = event.clientX
        currentRef.current.y = event.clientY
        setVisible(true)
      }
      setInteractive(Boolean(event.target.closest(interactiveSelector)))
    }

    const onLeave = () => {
      setVisible(false)
      setPressed(false)
    }

    const onDown = () => {
      setPressed(true)
    }

    const onUp = () => {
      setPressed(false)
    }

    const loop = () => {
      const tx = targetRef.current.x
      const ty = targetRef.current.y
      currentRef.current.x += (tx - currentRef.current.x) * 0.22
      currentRef.current.y += (ty - currentRef.current.y) * 0.22
      const x = currentRef.current.x
      const y = currentRef.current.y
      dotNode.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ringNode.style.transform = `translate3d(${x}px, ${y}px, 0)`
      rafRef.current = window.requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    rafRef.current = window.requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [enabled])

  if (!enabled) {
    return null
  }

  return (
    <>
      <span ref={ringRef} className="site-cursor-ring" />
      <span ref={dotRef} className="site-cursor-dot" />
    </>
  )
}
