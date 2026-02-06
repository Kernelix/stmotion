import { cx } from '@/lib/cx'

export function Grid({ className, children }) {
  return (
    <div className={cx('grid gap-8 md:gap-12', className)}>
      {children}
    </div>
  )
}
