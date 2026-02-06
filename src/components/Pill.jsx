import { cx } from '@/lib/cx'

export function Pill({ children, className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border border-ink-900/10 bg-paper-50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-ink-700',
        className
      )}
    >
      {children}
    </span>
  )
}
