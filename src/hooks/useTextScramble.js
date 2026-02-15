import { useCallback, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const DEFAULT_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#%&*+-'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function buildRevealMap(length) {
  if (length <= 1) {
    return [0]
  }
  return Array.from({ length }, (_, index) => {
    const base = index / (length - 1)
    const jitter = Math.random() * 0.22 - 0.11
    return clamp(base + jitter, 0, 1)
  })
}

function randomChar(charset) {
  const index = Math.floor(Math.random() * charset.length)
  return charset[index]
}

function createScrambledSeed(chars, charset) {
  return chars
    .map((char) => {
      if (char === ' ') {
        return ' '
      }
      return randomChar(charset)
    })
    .join('')
}

export function useTextScramble(targetText, options = {}) {
  const {
    enabled = true,
    trigger = 'view',
    once = true,
    duration = 640,
    fps = 60,
    startDelay = 0,
    charset = DEFAULT_CHARSET,
    viewThreshold = 0.45,
    viewRoot = null,
    viewRootMargin = '0px'
  } = options

  const reducedMotion = usePrefersReducedMotion()
  const [text, setText] = useState(() => {
    if (!enabled) {
      return targetText
    }
    if (trigger === 'mount' && targetText) {
      return createScrambledSeed(Array.from(targetText), charset)
    }
    return targetText
  })
  const elementRef = useRef(null)
  const rafRef = useRef(null)
  const timeoutRef = useRef(null)
  const observerRef = useRef(null)
  const startedRef = useRef(false)
  const completedRef = useRef(false)
  const revealMapRef = useRef([])
  const lastFrameTimeRef = useRef(0)
  const finalCharsRef = useRef([])

  const clearHandles = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  const finish = useCallback(() => {
    startedRef.current = false
    completedRef.current = true
    setText(targetText)
  }, [targetText])

  const run = useCallback(
    (force = false) => {
      if (!enabled) {
        setText(targetText)
        startedRef.current = false
        return
      }
      if (!targetText) {
        setText('')
        completedRef.current = true
        startedRef.current = false
        return
      }
      if (reducedMotion) {
        finish()
        return
      }
      if (!force && startedRef.current) {
        return
      }
      if (!force && once && completedRef.current) {
        return
      }

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }

      startedRef.current = true
      completedRef.current = false
      revealMapRef.current = buildRevealMap(targetText.length)
      finalCharsRef.current = Array.from(targetText)
      setText(createScrambledSeed(finalCharsRef.current, charset))
      lastFrameTimeRef.current = 0
      const frameInterval = 1000 / Math.max(1, fps)
      const totalDuration = Math.max(400, Math.min(900, duration))
      const startTime = performance.now()

      const tick = (now) => {
        if (!startedRef.current) {
          return
        }
        if (now - lastFrameTimeRef.current < frameInterval) {
          rafRef.current = window.requestAnimationFrame(tick)
          return
        }
        lastFrameTimeRef.current = now

        const elapsed = now - startTime
        const progress = clamp(elapsed / totalDuration, 0, 1)

        const next = finalCharsRef.current
          .map((char, index) => {
            if (char === ' ') {
              return ' '
            }
            if (progress >= revealMapRef.current[index]) {
              return char
            }
            return randomChar(charset)
          })
          .join('')

        setText(next)

        if (progress >= 1) {
          finish()
          return
        }
        rafRef.current = window.requestAnimationFrame(tick)
      }

      rafRef.current = window.requestAnimationFrame(tick)
    },
    [charset, duration, enabled, finish, fps, once, reducedMotion, targetText]
  )

  const onMouseEnter = useCallback(() => {
    if (trigger !== 'hover') {
      return
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => run(), Math.max(0, startDelay))
  }, [run, startDelay, trigger])

  useEffect(() => {
    if (!enabled) {
      clearHandles()
      setText(targetText)
      completedRef.current = false
      startedRef.current = false
      return
    }
    if (reducedMotion) {
      setText(targetText)
      completedRef.current = true
      startedRef.current = false
      return
    }
    if (trigger === 'mount' && targetText) {
      setText(createScrambledSeed(Array.from(targetText), charset))
    } else {
      setText(targetText)
    }
    completedRef.current = false
    startedRef.current = false
  }, [charset, clearHandles, enabled, reducedMotion, targetText, trigger])

  useEffect(() => {
    if (!enabled) {
      clearHandles()
      return undefined
    }
    if (reducedMotion) {
      clearHandles()
      finish()
      return undefined
    }

    if (trigger === 'mount') {
      timeoutRef.current = window.setTimeout(() => run(), Math.max(0, startDelay))
      return () => {
        clearHandles()
        startedRef.current = false
      }
    }

    if (trigger === 'view') {
      const node = elementRef.current
      if (!node) {
        return () => {
          clearHandles()
          startedRef.current = false
        }
      }

      if (typeof IntersectionObserver === 'undefined') {
        timeoutRef.current = window.setTimeout(() => run(), 0)
        return () => {
          clearHandles()
          startedRef.current = false
        }
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return
            }
            if (timeoutRef.current !== null) {
              window.clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = window.setTimeout(() => run(), Math.max(0, startDelay))
            if (once && observerRef.current) {
              observerRef.current.disconnect()
              observerRef.current = null
            }
          })
        },
        { threshold: viewThreshold, root: viewRoot, rootMargin: viewRootMargin }
      )

      observerRef.current.observe(node)
    }

    return () => {
      clearHandles()
      startedRef.current = false
    }
  }, [clearHandles, enabled, finish, once, reducedMotion, run, startDelay, trigger, viewRoot, viewRootMargin, viewThreshold])

  return {
    ref: elementRef,
    text,
    onMouseEnter,
    scramble: run
  }
}
