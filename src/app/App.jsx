import { Header } from '@/components/Header'
import { ScrollProgress } from '@/components/ScrollProgress'
import { HomePage } from '@/pages/HomePage'
import { ThreeScene } from '@/three/ThreeScene'

export default function App() {
  return (
    <div className="relative min-h-[100svh] overflow-x-hidden text-ink-900">
      <ThreeScene className="fixed inset-0 z-0 pointer-events-none" />
      <div className="pointer-events-none fixed inset-0 z-[1]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_rgba(246,246,242,0.2))]" />
        <div className="absolute inset-0 opacity-[0.18] [background-size:220px_220px] [background-image:linear-gradient(to_right,rgba(21,21,21,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(21,21,21,0.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_82%)]" />
      </div>
      <div className="relative z-10">
        <ScrollProgress />
        <Header />
        <HomePage />
      </div>
    </div>
  )
}
