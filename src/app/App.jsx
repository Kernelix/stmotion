import { useCallback, useEffect, useMemo, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { Header } from '@/components/Header'
import { ScrollProgress } from '@/components/ScrollProgress'
import { CustomCursor } from '@/components/CustomCursor'
import { SitePreloader } from '@/components/SitePreloader'
import { HomePage } from '@/pages/HomePage'
import { ThreeScene } from '@/three/ThreeScene'

export default function App() {
  const [domReady, setDomReady] = useState(() => document.readyState === 'complete')
  const [modelsReady, setModelsReady] = useState(false)
  const [forceReady, setForceReady] = useState(false)
  const { progress, total } = useProgress()
  const onModelsReady = useCallback(() => {
    setModelsReady(true)
  }, [])
  const modelProgress = modelsReady ? 100 : total > 0 ? progress : 0
  const preloadProgress = useMemo(() => {
    const safeModelProgress = Math.max(0, Math.min(100, modelProgress))
    // Разрешаем достичь 100% для корректного отображения "Финального штриха"
    const capped = domReady ? safeModelProgress : Math.min(safeModelProgress, 100)
    return Math.round(capped)
  }, [domReady, modelProgress])
  const ready = domReady && (modelsReady || forceReady)

  useEffect(() => {
    if (document.readyState === 'complete') {
      setDomReady(true)
      return undefined
    }
    const finish = () => {
      setDomReady(true)
    }
    window.addEventListener('load', finish, { once: true })

    return () => {
      window.removeEventListener('load', finish)
    }
  }, [])

  useEffect(() => {
    if (modelsReady) {
      return undefined
    }
    const timeoutId = window.setTimeout(() => {
      setForceReady(true)
    }, 12000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [modelsReady])

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

  useEffect(() => {
    const root = document.documentElement
    let rafId = null

    const applyViewportHeight = () => {
      const visualHeight = window.visualViewport?.height ?? window.innerHeight
      root.style.setProperty('--app-vh', `${visualHeight * 0.01}px`)
    }

    const scheduleApply = () => {
      if (rafId !== null) {
        return
      }
      rafId = window.requestAnimationFrame(() => {
        rafId = null
        applyViewportHeight()
      })
    }

    applyViewportHeight()

    window.addEventListener('resize', scheduleApply)
    window.addEventListener('orientationchange', scheduleApply)
    window.visualViewport?.addEventListener('resize', scheduleApply)
    window.visualViewport?.addEventListener('scroll', scheduleApply)

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('resize', scheduleApply)
      window.removeEventListener('orientationchange', scheduleApply)
      window.visualViewport?.removeEventListener('resize', scheduleApply)
      window.visualViewport?.removeEventListener('scroll', scheduleApply)
    }
  }, [])

  return (
    <div className="app-shell app-viewport-min relative overflow-x-hidden text-ink-900">
      <ThreeScene className="pointer-events-none fixed inset-x-0 top-0 z-0 w-screen app-viewport-height" onModelsReady={onModelsReady} />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[1] w-screen app-viewport-height">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_rgba(246,246,242,0.02))]" />
        <div className="absolute inset-0 opacity-[0.1] [background-size:220px_220px] [background-image:linear-gradient(to_right,rgba(21,21,21,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(21,21,21,0.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_82%)]" />
      </div>
      <div className="relative z-10">
        <SitePreloader visible={!ready} progress={preloadProgress} />
        <CustomCursor />
        <ScrollProgress />
        <Header />
        <HomePage effectsEnabled={ready} />
      </div>
    </div>
  )
}
