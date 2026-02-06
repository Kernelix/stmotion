import { cx } from '@/lib/cx'

export function BigHeadline({ as = 'h1', className, children }) {
  const Component = as
  return (
    <Component
      className={cx(
        'font-display text-5xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-6xl md:text-7xl lg:text-8xl',
        className
      )}
    >
      {children}
    </Component>
  )
}
