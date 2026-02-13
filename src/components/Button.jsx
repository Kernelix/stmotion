import { cx } from '@/lib/cx'

export function Button({ className, variant = 'primary', children, ...props }) {
  const styles = cx(
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--accent))]',
    variant === 'primary'
      ? 'bg-ink-900 text-paper-50 shadow-soft hover:-translate-y-0.5 hover:bg-ink-700'
      : variant === 'accent'
        ? 'border border-[rgb(var(--accent-strong)/0.45)] bg-transparent text-ink-900 hover:-translate-y-0.5 hover:border-[rgb(var(--accent)/0.35)] active:border-[rgb(var(--accent)/0.4)]'
        : 'border border-ink-900/15 bg-paper-50 text-ink-900 hover:-translate-y-0.5 hover:border-accent-400',
    className
  )

  if ('href' in props) {
    return (
      <a className={styles} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  )
}
