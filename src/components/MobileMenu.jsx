import { navLinks } from '@/content/nav'
import { Button } from '@/components/Button'
import { Link } from '@/components/Link'
import { cx } from '@/lib/cx'

export function MobileMenu({ open, onClose }) {
  return (
    <div
      className={cx(
        'mobile-menu mobile-menu-surface fixed inset-0 z-40 flex flex-col backdrop-blur-sm transition-opacity duration-300',
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      style={{ height: '100svh', minHeight: '100svh', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between px-6 py-6">
        <span className="text-caption-dark text-xs uppercase tracking-[0.32em]">Навигация</span>
        <Button type="button" variant="ghost" onClick={onClose} className="mobile-menu-close border-[rgb(201_211_227/0.28)] bg-[rgb(10_13_20/0.32)]">
          Закрыть
        </Button>
      </div>
      <div className="flex flex-1 flex-col justify-between px-6 pb-10">
        <nav className="text-on-dark-primary flex flex-col gap-6 text-2xl font-semibold">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose} className="mobile-menu-link text-2xl">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-meta space-y-4 text-sm">
          <p>Доступен для выборочных коллабораций на стыке продукта, бренда и опыта реального времени.</p>
          <Link href="#contact" className="mobile-menu-link" onClick={onClose}>
            Начать проект
          </Link>
        </div>
      </div>
    </div>
  )
}
