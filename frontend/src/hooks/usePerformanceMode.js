import { useEffect, useState } from 'react'

function getPerformanceMode() {
  if (typeof window === 'undefined') {
    return { reduceMotion: false, lowPower: false, finePointer: true }
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const finePointer = window.matchMedia('(pointer: fine)').matches
  const lowMemory = navigator.deviceMemory ? navigator.deviceMemory <= 4 : false
  const lowCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false

  return {
    reduceMotion,
    finePointer,
    lowPower: reduceMotion || !finePointer || lowMemory || lowCores,
  }
}

export function usePerformanceMode() {
  const [mode, setMode] = useState(getPerformanceMode)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(pointer: fine)')

    function updateMode() {
      setMode(getPerformanceMode())
    }

    motionQuery.addEventListener('change', updateMode)
    pointerQuery.addEventListener('change', updateMode)
    updateMode()

    return () => {
      motionQuery.removeEventListener('change', updateMode)
      pointerQuery.removeEventListener('change', updateMode)
    }
  }, [])

  return mode
}
