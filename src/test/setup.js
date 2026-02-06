import '@testing-library/jest-dom/vitest'

if (!window.matchMedia) {
  window.matchMedia = (query) => {
    const listeners = new Set()
    const mediaQueryList = {
      media: query,
      matches: false,
      onchange: null,
      addEventListener: (_type, listener) => {
        listeners.add(listener)
      },
      removeEventListener: (_type, listener) => {
        listeners.delete(listener)
      },
      addListener: (listener) => {
        listeners.add(listener)
      },
      removeListener: (listener) => {
        listeners.delete(listener)
      },
      dispatchEvent: (event) => {
        listeners.forEach((listener) => listener(event))
        return true
      }
    }
    return mediaQueryList
  }
}
