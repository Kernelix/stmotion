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
      viewport={{ amount: 0.16, once: false }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.11,
            delayChildren: 0.04
          }
        }
      }}
      style={{ transformPerspective: 1150 }}
    >
      {items.map((child, index) => (
        <motion.div
          key={`grid-item-${index}`}
          custom={index}
          variants={{
            hidden: (i) => ({
              opacity: 0,
              scale: 0.982,
              rotateX: -7,
              rotateY: i % 2 === 0 ? -1.8 : 1.8,
              filter: 'blur(9px) saturate(0.92)'
            }),
            visible: {
              opacity: 1,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              filter: 'blur(0px) saturate(1)',
              transition: {
                ease: easing,
                opacity: { duration: 0.62 },
                scale: { duration: 0.98 },
                rotateX: { duration: 0.98 },
                rotateY: { duration: 0.98 },
                filter: { duration: 0.82 }
              }
            }
          }}
          className="will-change-transform [transform-style:preserve-3d]"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
