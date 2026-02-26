import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks'
import { cx } from '@/lib/cx'

const easing = [0.22, 1, 0.36, 1]

export function RevealText({
  as = 'p',
  text,
  lines,
  className,
  delay = 0,
  stagger = 0.05,
  highlightWords = [],
  highlightClassName = ''
}) {
  const reducedMotion = usePrefersReducedMotion()
  const Component = as
  const content = lines ? lines.join(' ') : text
  const tokens = lines ?? text.split(' ')
  const isLines = Boolean(lines)

  if (reducedMotion) {
    return (
      <Component className={className}>
        {isLines
          ? tokens.map((line, index) => (
              <span key={`${line}-${index}`} className="block">
                {line}
              </span>
            ))
          : text}
      </Component>
    )
  }

  return (
    <Component className={className} aria-label={content}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.5, once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: stagger,
              delayChildren: delay
            }
          }
        }}
        className="inline-block [transform-style:preserve-3d]"
        style={{ transformPerspective: 1000 }}
      >
        {tokens.map((token, index) => {
          const clean = token.replace(/[^\w-]/g, '')
          return (
            <motion.span
              key={`${token}-${index}`}
              variants={{
                hidden: {
                  opacity: 0,
                  scale: 0.97,
                  rotateX: -10,
                  filter: 'blur(6px) saturate(0.94)'
                },
                visible: {
                  opacity: 1,
                  scale: 1,
                  rotateX: 0,
                  filter: 'blur(0px) saturate(1)',
                  transition: {
                    ease: easing,
                    opacity: { duration: 0.55 },
                    scale: { duration: 0.92 },
                    rotateX: { duration: 0.92 },
                    filter: { duration: 0.78 }
                  }
                }
              }}
              className={cx('inline-block overflow-hidden [transform-style:preserve-3d]', isLines ? 'block' : '')}
            >
              <span className={cx(highlightWords.includes(clean) ? highlightClassName : '')}>
                {token}
                {!isLines && index < tokens.length - 1 ? ' ' : ''}
              </span>
            </motion.span>
          )
        })}
      </motion.span>
    </Component>
  )
}
