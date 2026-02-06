import { cx } from '@/lib/cx'

export function Divider({ className }) {
  return <div className={cx('h-px w-full bg-paper-200', className)} />
}
