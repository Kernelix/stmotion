import { useEffect, useState } from 'react'
import { isLowEndDevice } from '@/lib/device'

export function useIsLowEndDevice() {
  const [lowEnd, setLowEnd] = useState(false)

  useEffect(() => {
    setLowEnd(isLowEndDevice())
  }, [])

  return lowEnd
}
