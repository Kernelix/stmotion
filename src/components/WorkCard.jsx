import { cx } from '@/lib/cx'
import { Pill } from '@/components/Pill'

export function WorkCard({ project, className }) {
  return (
    <article
      className={cx(
        'group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/22 bg-ink-900/60 p-6 shadow-soft backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/38',
        className
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/72">
          <span>Проект</span>
          <span>{project.year}</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          <p className="text-sm leading-relaxed text-white/86">{project.description}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Pill key={tag} className="border-white/24 bg-white/8 text-white/84">
            {tag}
          </Pill>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-white/70 transition-transform duration-500 group-hover:scale-x-100" />
    </article>
  )
}
