import { useState } from 'react'
import { Button } from '@/components/Button'
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
        'card-dark-readable flex flex-col gap-4 rounded-2xl border border-white/22 bg-ink-900/60 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/38',
        className
      )}
    >
      <div className="space-y-2">
        <p className="text-on-dark-muted text-xs uppercase tracking-[0.28em]">{label}</p>
        <a href={href} className="contact-value on-dark-link text-base font-semibold" style={{ color: 'var(--text-on-dark-primary)' }}>
          {value}
        </a>
      </div>
      <Button
        type="button"
        variant="ghost"
        onClick={handleCopy}
        aria-live="polite"
        className="contact-action text-on-dark-primary border-[rgb(201_211_227/0.3)] bg-transparent hover:border-[rgb(201_211_227/0.52)] hover:bg-[rgb(201_211_227/0.1)]"
        style={{ color: 'var(--text-on-dark-primary)' }}
      >
        {copied ? 'Скопировано' : 'Скопировать'}
      </Button>
    </div>
  )
}
