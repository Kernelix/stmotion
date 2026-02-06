import { cx } from '@/lib/cx'

export function Caption({ className, children }) {
  return (
    <p className={cx('text-xs uppercase tracking-[0.32em] text-ink-500', className)}>{children}</p>
  )
}
