import { cx } from '@/lib/cx'
import { Pill } from '@/components/Pill'

export function WorkCard({ project, className }) {
  return (
    <article
      className={cx(
        'card-dark-readable group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/22 bg-ink-900/60 p-6 shadow-soft backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/38',
        className
      )}
    >
      <div className="space-y-4">
        <div className="text-on-dark-muted flex items-center justify-between text-xs uppercase tracking-[0.28em]">
          <span>Проект</span>
          <span>{project.year}</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-on-dark-primary text-xl font-semibold">{project.title}</h3>
          <p className="text-on-dark-secondary text-sm leading-relaxed">{project.description}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Pill key={tag} className="border-[rgb(201_211_227/0.4)] bg-[rgb(201_211_227/0.16)] text-on-dark-primary">
            {tag}
          </Pill>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[rgb(201_211_227/0.7)] transition-transform duration-500 group-hover:scale-x-100" />
    </article>
  )
}
