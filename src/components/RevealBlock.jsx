import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks'
import { cx } from '@/lib/cx'

const easing = [0.22, 1, 0.36, 1]

export function RevealBlock({ className, children, delay = 0 }) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.985,
        rotateX: -4,
        rotateY: 1.2,
        filter: 'blur(10px) saturate(0.92)'
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        filter: 'blur(0px) saturate(1)'
      }}
      viewport={{ amount: 0.2, once: false }}
      transition={{
        delay,
        ease: easing,
        opacity: { duration: 0.62 },
        rotateX: { duration: 0.95 },
        rotateY: { duration: 0.95 },
        scale: { duration: 0.95 },
        filter: { duration: 0.8 }
      }}
      className={cx('will-change-transform [transform-style:preserve-3d]', className)}
      style={{ transformPerspective: 1100 }}
    >
      {children}
    </motion.div>
  )
}
