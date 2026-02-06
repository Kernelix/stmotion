import { useSyncExternalStore } from 'react'
import { scrollStore } from '@/lib/scrollStore'

export function useScrollProgress() {
  return useSyncExternalStore(
    scrollStore.subscribe,
    () => scrollStore.getState().progress,
    () => 0
  )
}
