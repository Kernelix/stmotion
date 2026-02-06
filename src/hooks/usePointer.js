import { useEffect, useRef } from 'react'

export function usePointer(active = true, onChange) {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!active) {
      pointer.current.x = 0
      pointer.current.y = 0
      return
    }

    let frame = null

    const update = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = (event.clientY / window.innerHeight) * 2 - 1
      if (frame) {
        return
      }
      frame = window.requestAnimationFrame(() => {
        frame = null
        pointer.current.x = x
        pointer.current.y = y
        if (onChange) {
          onChange()
        }
      })
    }

    const reset = () => {
      if (frame) {
        return
      }
      frame = window.requestAnimationFrame(() => {
        frame = null
        pointer.current.x = 0
        pointer.current.y = 0
        if (onChange) {
          onChange()
        }
      })
    }

    window.addEventListener('pointermove', update, { passive: true })
    window.addEventListener('pointerleave', reset, { passive: true })
    window.addEventListener('blur', reset)

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
      window.removeEventListener('pointermove', update)
      window.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
    }
  }, [active, onChange])

  return pointer
}
