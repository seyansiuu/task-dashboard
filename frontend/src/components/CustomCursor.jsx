import { memo, useEffect, useRef } from 'react'

const INTERACTIVE_SELECTOR = 'button, .task-card'

function CustomCursor({ enabled = true }) {
  const dotRef = useRef(null)
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window

  useEffect(() => {
    if (!enabled || isTouchDevice || !window.matchMedia('(pointer: fine)').matches) return undefined

    const dot = dotRef.current
    if (!dot) return undefined

    let rafId = 0
    let interactive = false
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY

    function setInteractive(nextInteractive) {
      if (interactive === nextInteractive) return
      interactive = nextInteractive
    }

    function animate() {
      currentX += (targetX - currentX) * 0.12
      currentY += (targetY - currentY) * 0.12

      dot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${interactive ? 2 : 1})`
      rafId = window.requestAnimationFrame(animate)
    }

    function handlePointerMove(event) {
      targetX = event.clientX
      targetY = event.clientY
      dot.style.opacity = '0.5'
      setInteractive(Boolean(event.target.closest(INTERACTIVE_SELECTOR)))
    }

    function handlePointerLeave() {
      dot.style.opacity = '0'
    }

    rafId = window.requestAnimationFrame(animate)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handlePointerLeave)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave)
    }
  }, [enabled, isTouchDevice])

  if (!enabled || isTouchDevice) return null

  return <div ref={dotRef} className="cursor-dot" />
}

export default memo(CustomCursor)
