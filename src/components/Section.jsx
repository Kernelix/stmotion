import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks'
import { cx } from '@/lib/cx'

const easing = [0.22, 1, 0.36, 1]

export function Section({ id, className, children }) {
  const reducedMotion = usePrefersReducedMotion()
  const Component = reducedMotion ? 'section' : motion.section

  return (
    <Component
      id={id}
      className={cx('scroll-mt-24 py-18 md:scroll-mt-28 md:py-26', className)}
      {...(reducedMotion
        ? {}
        : {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            viewport: { amount: 0.1, once: false },
            transition: { duration: 1.2, ease: easing }
          })}
    >
      {children}
    </Component>
  )
}
