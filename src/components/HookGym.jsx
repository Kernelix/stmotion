import { useMemo, useState } from 'react'
import { hooks } from '@/content/hooks'
import { useDebouncedValue, useMediaQuery, usePrefersReducedMotion, useScrollProgress } from '@/hooks'
import { cx } from '@/lib/cx'

function DemoMediaQuery() {
  const isWide = useMediaQuery('(min-width: 900px)')
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-paper-50 p-4 text-sm text-ink-700">
      <div className="text-xs uppercase tracking-[0.28em] text-ink-500">Вьюпорт</div>
      <div className="mt-2 text-lg font-semibold text-ink-900">{isWide ? 'Широкий' : 'Компактный'}</div>
    </div>
  )
}

function DemoReducedMotion() {
  const reduced = usePrefersReducedMotion()
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-paper-50 p-4 text-sm text-ink-700">
      <div className="text-xs uppercase tracking-[0.28em] text-ink-500">Предпочтение анимации</div>
      <div className="mt-2 text-lg font-semibold text-ink-900">
        {reduced ? 'Сниженная анимация' : 'Полная анимация'}
      </div>
    </div>
  )
}

function DemoDebouncedValue() {
  const [value, setValue] = useState('')
  const debounced = useDebouncedValue(value, 500)
  const diff = useMemo(() => (value === debounced ? 'Синхронизировано' : 'В ожидании'), [value, debounced])

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-paper-50 p-4 text-sm text-ink-700">
      <div className="text-xs uppercase tracking-[0.28em] text-ink-500">Поле с дебаунсом</div>
      <input
        className="mt-3 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2 text-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--accent))]"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Введите текст"
      />
      <div className="mt-3 text-xs uppercase tracking-[0.28em] text-ink-500">Статус</div>
      <div className="mt-1 text-base font-semibold text-ink-900">{diff}</div>
    </div>
  )
}

function DemoScrollProgress() {
  const progress = useScrollProgress()
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-paper-50 p-4 text-sm text-ink-700">
      <div className="text-xs uppercase tracking-[0.28em] text-ink-500">Прогресс скролла</div>
      <div className="mt-2 h-2 w-full rounded-full bg-paper-200">
        <div
          className="h-full rounded-full bg-accent-500 transition-[width] duration-200"
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
      <div className="mt-2 text-base font-semibold text-ink-900">
        {Math.round(progress * 100)}% редакционный скролл
      </div>
    </div>
  )
}

export function HookGym() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.32em] text-ink-500">Гимнастика хуков</div>
          <h3 className="text-2xl font-semibold text-ink-900">Тренажер для кастомных хуков</h3>
          <p className="text-sm leading-relaxed text-ink-700">
            Каждый хук идет с тестами. Падающие намеренно оставлены, чтобы вы реализовали их позже.
          </p>
        </div>
        <div className="space-y-3">
          {hooks.map((hook) => (
            <div
              key={hook.id}
              className={cx(
                'flex items-start justify-between gap-4 rounded-2xl border border-ink-900/10 bg-paper-50 p-4',
                hook.status === 'passed' ? 'shadow-soft' : 'opacity-70'
              )}
            >
              <div>
                <div className="text-sm font-semibold text-ink-900">{hook.name}</div>
                <div className="text-xs text-ink-500">{hook.description}</div>
              </div>
              <span
                className={cx(
                  'rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]',
                  hook.status === 'passed'
                    ? 'bg-accent-300/40 text-ink-900'
                    : 'bg-paper-200 text-ink-500'
                )}
              >
                {hook.status === 'passed' ? 'готово' : 'в работе'}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <DemoMediaQuery />
        <DemoReducedMotion />
        <DemoDebouncedValue />
        <DemoScrollProgress />
      </div>
    </div>
  )
}
