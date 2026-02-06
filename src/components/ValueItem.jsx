import { cx } from '@/lib/cx'

export function ValueItem({ title, description, className, children }) {
  return (
    <div
      className={cx(
        'rounded-2xl border border-ink-900/10 bg-paper-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-accent-300',
        className
      )}
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
        <p className="text-sm leading-relaxed text-ink-700">{description}</p>
        {children}
      </div>
    </div>
  )
}
