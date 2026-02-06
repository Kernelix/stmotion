const state = { y: 0, progress: 0, max: 0, viewport: 0 }
const listeners = new Set()
let rafId = null
let initialized = false

const update = () => {
  const doc = document.documentElement
  const viewport = doc.clientHeight || window.innerHeight || 0
  const max = Math.max(doc.scrollHeight - viewport, 0)
  const y = window.scrollY || doc.scrollTop || 0
  const progress = max > 0 ? y / max : 0
  const changed =
    Math.abs(y - state.y) > 0.5 ||
    Math.abs(progress - state.progress) > 0.0005 ||
    max !== state.max ||
    viewport !== state.viewport

  state.y = y
  state.progress = progress
  state.max = max
  state.viewport = viewport

  if (changed) {
    listeners.forEach((listener) => listener())
  }
}

const onScroll = () => {
  if (rafId) {
    return
  }
  rafId = window.requestAnimationFrame(() => {
    rafId = null
    update()
  })
}

const init = () => {
  if (initialized) {
    return
  }
  initialized = true
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  window.addEventListener('load', onScroll)
}

export const scrollStore = {
  getState: () => state,
  subscribe: (listener) => {
    init()
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }
}
