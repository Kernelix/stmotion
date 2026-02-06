import { useEffect, useState } from 'react'
import { navLinks } from '@/content/nav'
import { Button } from '@/components/Button'
import { Link } from '@/components/Link'
import { MobileMenu } from '@/components/MobileMenu'

export function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink-900/5 bg-paper-50/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.4em] text-ink-500">ST Celestial</span>
            <span className="text-sm font-semibold text-ink-900">Motion Studio</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-ink-700 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex">
            <Button href="#contact">Записаться на звонок</Button>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2 text-xs uppercase tracking-[0.28em] text-ink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 md:hidden"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            Меню
          </button>
        </div>
      </header>
      <div id="mobile-menu">
        <MobileMenu open={open} onClose={() => setOpen(false)} />
      </div>
    </>
  )
}
