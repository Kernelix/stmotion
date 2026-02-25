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
        'flex flex-col gap-4 rounded-2xl border border-white/22 bg-ink-900/60 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/38',
        className
      )}
    >
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-white/72">{label}</p>
        <Link href={href} className="text-base font-semibold text-white before:bg-white/60 after:bg-white/75 hover:text-white">
          {value}
        </Link>
      </div>
      <Button
        type="button"
        variant="ghost"
        onClick={handleCopy}
        aria-live="polite"
        className="border-white/28 bg-transparent text-white hover:border-white/48 hover:bg-white/8"
      >
        {copied ? 'Скопировано' : 'Скопировать'}
      </Button>
    </div>
  )
}
