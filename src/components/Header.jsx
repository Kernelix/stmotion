import { useEffect, useState } from 'react'
import { navLinks } from '@/content/nav'
import { Button } from '@/components/Button'
import { Link } from '@/components/Link'
import { MobileMenu } from '@/components/MobileMenu'
import { scrollStore } from '@/lib/scrollStore'

export function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const sections = navLinks.map((link) => document.querySelector(link.href)).filter(Boolean)
    if (!sections.length) {
      return
    }
    let frame = null
    const update = () => {
      frame = null
      const midpoint = window.innerHeight * 0.45
      let current = ''
      for (let i = 0; i < sections.length; i += 1) {
        const rect = sections[i].getBoundingClientRect()
        if (rect.top <= midpoint && rect.bottom >= midpoint) {
          current = navLinks[i].href
          break
        }
      }
      if (!current) {
        const firstRect = sections[0].getBoundingClientRect()
        if (firstRect.top > midpoint) {
          current = navLinks[0].href
        } else {
          const lastRect = sections[sections.length - 1].getBoundingClientRect()
          if (lastRect.top < midpoint) {
            current = navLinks[sections.length - 1].href
          }
        }
      }
      setActive((prev) => (prev === current ? prev : current))
    }
    update()
    const unsubscribe = scrollStore.subscribe(() => {
      if (frame) {
        return
      }
      frame = window.requestAnimationFrame(update)
    })
    window.addEventListener('resize', update)
    window.addEventListener('load', update)
    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
      unsubscribe()
      window.removeEventListener('resize', update)
      window.removeEventListener('load', update)
    }
  }, [navLinks, scrollStore])

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
              <Link
                key={link.href}
                href={link.href}
                data-active={active === link.href ? 'true' : 'false'}
                aria-current={active === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex">
            <Button href="#contact" variant="accent">
              Обсудить проект
            </Button>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 px-4 py-2 text-xs uppercase tracking-[0.28em] text-ink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--accent))] md:hidden"
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
