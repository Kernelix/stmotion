import { Children } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks'
import { cx } from '@/lib/cx'

const easing = [0.22, 1, 0.36, 1]

export function RevealGrid({ className, children }) {
  const reducedMotion = usePrefersReducedMotion()
  const items = Children.toArray(children)

  if (reducedMotion) {
    return <div className={cx('grid gap-8 md:gap-12', className)}>{items}</div>
  }

  return (
    <motion.div
      className={cx('grid gap-8 md:gap-12', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.15, once: false }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.08
          }
        }
      }}
    >
      {items.map((child, index) => (
        <motion.div
          key={`grid-item-${index}`}
          variants={{
            hidden: { opacity: 0, y: 20, rotateX: -4 },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: { duration: 1, ease: easing }
            }
          }}
          className="will-change-transform"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
