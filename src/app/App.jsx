import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { ScrollProgress } from '@/components/ScrollProgress'
import { CustomCursor } from '@/components/CustomCursor'
import { SitePreloader } from '@/components/SitePreloader'
import { HomePage } from '@/pages/HomePage'
import { ThreeScene } from '@/three/ThreeScene'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let timer = null
    const finish = () => {
      timer = window.setTimeout(() => {
        setReady(true)
      }, 720)
    }

    if (document.readyState === 'complete') {
      finish()
    } else {
      window.addEventListener('load', finish, { once: true })
    }

    return () => {
      if (timer !== null) {
        window.clearTimeout(timer)
      }
      window.removeEventListener('load', finish)
    }
  }, [])

  useEffect(() => {
    const ua = navigator.userAgent || ''
    const params = new URLSearchParams(window.location.search)
    const forceTg = params.get('tg') === '1'
    const isTelegram =
      /Telegram/i.test(ua) ||
      /t\.me|telegram\.org/i.test(document.referrer) ||
      Boolean(window.Telegram?.WebApp)
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    document.body.classList.toggle('is-ios-webview', isIOS)
    document.body.classList.toggle('is-ios-tgwebview', isIOS && (forceTg || isTelegram))

    return () => {
      document.body.classList.remove('is-ios-webview')
      document.body.classList.remove('is-ios-tgwebview')
    }
  }, [])

  return (
    <div className="app-shell relative min-h-[100svh] overflow-x-hidden text-ink-900">
      <ThreeScene className="fixed inset-0 z-0 pointer-events-none" />
      <div className="pointer-events-none fixed inset-0 z-[1]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_rgba(246,246,242,0.2))]" />
        <div className="absolute inset-0 opacity-[0.18] [background-size:220px_220px] [background-image:linear-gradient(to_right,rgba(21,21,21,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(21,21,21,0.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_82%)]" />
      </div>
      <div className="relative z-10">
        <SitePreloader visible={!ready} />
        <CustomCursor />
        <ScrollProgress />
        <Header />
        <HomePage effectsEnabled={ready} />
      </div>
    </div>
  )
}
