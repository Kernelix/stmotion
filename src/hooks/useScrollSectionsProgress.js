import { useEffect, useMemo, useRef, useState } from 'react'
import { sceneSectionIds } from '@/three/sceneKeyframes'

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)

export function useScrollSectionsProgress(sectionIds = sceneSectionIds) {
  const ids = useMemo(() => {
    const unique = []
    sectionIds.forEach((id) => {
      if (typeof id !== 'string' || !id.trim()) {
        return
      }
      if (unique.includes(id)) {
        return
      }
      unique.push(id)
    })
    return unique
  }, [sectionIds])

  const [value, setValue] = useState({ index: 0, t: 0 })
  const sectionsRef = useRef([])
  const rafRef = useRef(null)
  const latestRef = useRef({ index: 0, t: 0 })

  useEffect(() => {
    const measure = () => {
      sectionsRef.current = ids
        .map((id) => {
          const element = document.getElementById(id)
          return element ? { id, element } : null
        })
        .filter(Boolean)
    }

    const compute = () => {
      rafRef.current = null
      const sections = sectionsRef.current
      if (!sections.length) {
        return
      }

      const scrollY = window.scrollY || document.documentElement.scrollTop || 0
      const viewport = window.innerHeight || document.documentElement.clientHeight || 1
      const midpoint = scrollY + viewport * 0.45
      const positions = sections.map(({ element }) => {
        const rect = element.getBoundingClientRect()
        return {
          top: rect.top + scrollY,
          height: Math.max(rect.height, viewport * 0.7)
        }
      })

      let index = 0
      for (let i = 0; i < positions.length; i += 1) {
        const end = positions[i + 1]?.top ?? positions[i].top + positions[i].height
        if (midpoint >= end) {
          index = Math.min(i + 1, positions.length - 1)
          continue
        }
        index = i
        break
      }

      const start = positions[index].top
      const end = positions[index + 1]?.top ?? positions[index].top + positions[index].height
      const t = clamp((midpoint - start) / Math.max(end - start, 1))
      const next = { index, t }
      const prev = latestRef.current

      if (prev.index === next.index && Math.abs(prev.t - next.t) < 0.002) {
        return
      }

      latestRef.current = next
      setValue(next)
    }

    const schedule = () => {
      if (rafRef.current !== null) {
        return
      }
      rafRef.current = window.requestAnimationFrame(compute)
    }

    const onResize = () => {
      measure()
      schedule()
    }
    const onLoad = () => {
      measure()
      schedule()
    }

    measure()
    compute()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', onLoad)

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onLoad)
    }
  }, [ids])

  return value
}
