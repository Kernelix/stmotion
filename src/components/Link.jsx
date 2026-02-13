import { cx } from '@/lib/cx'

export function Link({ className, children, ...props }) {
  return (
    <a
      className={cx(
        'relative inline-flex items-center gap-2 text-sm font-medium text-ink-900 transition duration-300 before:absolute before:-left-3 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-[rgb(var(--accent))] before:opacity-0 before:transition-opacity before:duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[rgb(var(--accent))] after:transition-transform after:duration-300 hover:after:scale-x-100 data-[active=true]:before:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--accent))]',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
