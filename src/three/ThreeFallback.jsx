export function ThreeFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-ink-900/10 bg-paper-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(43,124,255,0.25),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(140deg,_rgba(250,250,245,0.9),_rgba(236,239,247,0.6))]" />
      <div className="relative text-center text-sm uppercase tracking-[0.32em] text-ink-500">
        3D предпросмотр отключен
      </div>
    </div>
  )
}
