import { useState } from 'react'
import { Button } from '@/components/Button'
import { Link } from '@/components/Link'
import { cx } from '@/lib/cx'

export function ContactBlock({ label, value, href, className }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className={cx(
        'flex flex-col gap-4 rounded-2xl border border-ink-900/10 bg-paper-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-accent-300',
        className
      )}
    >
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-ink-500">{label}</p>
        <Link href={href} className="text-base font-semibold">
          {value}
        </Link>
      </div>
      <Button type="button" variant="ghost" onClick={handleCopy} aria-live="polite">
        {copied ? 'Скопировано' : 'Скопировать'}
      </Button>
    </div>
  )
}
