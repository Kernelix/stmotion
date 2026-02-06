import { cx } from '@/lib/cx'

export function Container({ className, children }) {
  return (
    <div className={cx('mx-auto w-full max-w-7xl px-6 md:px-10', className)}>
      {children}
    </div>
  )
}
