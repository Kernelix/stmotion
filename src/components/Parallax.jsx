import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks'
import { cx } from '@/lib/cx'

export function Parallax({ className, children, offset = 80 }) {
  const reducedMotion = usePrefersReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  if (reducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} style={{ y }} className={cx('will-change-transform', className)}>
      {children}
    </motion.div>
  )
}
