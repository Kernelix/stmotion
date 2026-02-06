import { navLinks } from '@/content/nav'
import { Button } from '@/components/Button'
import { Link } from '@/components/Link'
import { cx } from '@/lib/cx'

export function MobileMenu({ open, onClose }) {
  return (
    <div
      className={cx(
        'fixed inset-0 z-40 flex flex-col bg-paper-50/95 backdrop-blur-sm transition-opacity duration-300',
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      style={{ height: '100svh', paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between px-6 py-6">
        <span className="text-xs uppercase tracking-[0.32em] text-ink-500">Навигация</span>
        <Button type="button" variant="ghost" onClick={onClose}>
          Закрыть
        </Button>
      </div>
      <div className="flex flex-1 flex-col justify-between px-6 pb-10">
        <nav className="flex flex-col gap-6 text-2xl font-semibold text-ink-900">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose} className="text-2xl">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-4 text-sm text-ink-700">
          <p>Доступен для выборочных коллабораций на стыке продукта, бренда и опыта реального времени.</p>
          <Link href="#contact">Начать проект</Link>
        </div>
      </div>
    </div>
  )
}
