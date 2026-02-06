import { cx } from '@/lib/cx'

export function Link({ className, children, ...props }) {
  return (
    <a
      className={cx(
        'relative inline-flex items-center gap-2 text-sm font-medium text-ink-900 transition duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent-500 after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
