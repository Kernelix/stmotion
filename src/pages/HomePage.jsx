import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import { Container } from '@/components/Container'
import { Section } from '@/components/Section'
import { Caption } from '@/components/Caption'
import { Button } from '@/components/Button'
import { Divider } from '@/components/Divider'
import { WorkCard } from '@/components/WorkCard'
import { ContactBlock } from '@/components/ContactBlock'
import { RevealText } from '@/components/RevealText'
import { RevealBlock } from '@/components/RevealBlock'
import { RevealGrid } from '@/components/RevealGrid'
import { Parallax } from '@/components/Parallax'
import { ScrambleText } from '@/components/ScrambleText'
import { projects } from '@/content/projects'
import { services } from '@/content/services'
import { values } from '@/content/values'
import { contacts } from '@/content/contact'
import { usePrefersReducedMotion } from '@/hooks'
import { scrollStore } from '@/lib/scrollStore'
import { cx } from '@/lib/cx'

const easing = [0.22, 1, 0.36, 1]
const threeStack = ['Three.js', 'React Three Fiber', '@react-three/drei', 'GLSL basics', 'Blender assets', 'WebGL optimization']
const designStack = ['Figma', 'After Effects', 'Spline', 'DaVinci Resolve', 'Typography systems', 'Motion direction']
const ccByUrl = 'http://creativecommons.org/licenses/by/4.0/'
const modelCredits = [
  {
    title: 'Evanescent Plasma',
    modelUrl: 'https://skfb.ly/orsrB',
    author: 'Tycho Magnetic Anomaly',
    authorUrl: 'https://sketchfab.com/Tycho_Magnetic_Anomaly'
  },
  {
    title: 'Primary Ion Drive ///',
    modelUrl: 'https://skfb.ly/Yx8S',
    author: 'indierocktopus',
    authorUrl: 'https://sketchfab.com/indierocktopus'
  },
  {
    title: '#24 Dizzying space travel - "Inktober2019"',
    modelUrl: 'https://sketchfab.com/3d-models/24-dizzying-space-travel-inktober2019-08ee5e4cabee421ebf0b2cc927d4d6fc',
    author: 'Canary Games',
    authorUrl: 'https://sketchfab.com/CanaryGames'
  }
]

function FlowPanels({ kicker, title, description, cta, items, renderPanel, effectsEnabled = true }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[0.55fr_1fr]">
      <div className="space-y-6 lg:sticky lg:top-24 self-start">
        <div className="space-y-3">
          <Caption>{kicker}</Caption>
          <ScrambleText
            as="h2"
            text={title}
            className="font-display text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl"
            enabled={effectsEnabled}
            trigger="view"
            duration={760}
            viewThreshold={0.35}
          />
          <p className="text-sm leading-relaxed text-ink-700">{description}</p>
        </div>
        {cta ? (
          <Button href={cta.href} variant="ghost">
            {cta.label}
          </Button>
        ) : null}
      </div>
      <div className="space-y-6">
        {items.map((item, index) => (
          <RevealBlock key={item.title ?? index} delay={index * 0.05}>
            {renderPanel(item, index)}
          </RevealBlock>
        ))}
      </div>
    </div>
  )
}

function StickyPanel({ progressValue, index, total, activeIndex, children }) {
  const start = index / total
  const end = (index + 1) / total
  const progress = useTransform(progressValue, [start, end], [0, 1], { clamp: true })
  const y = useTransform(progress, [0, 1], [30, -30])
  const scale = useTransform(progress, [0, 1], [0.99, 1])
  const isActive = activeIndex === index

  return (
    <motion.div
      className="absolute inset-0"
      initial="inactive"
      animate={isActive ? 'active' : 'inactive'}
      variants={{
        active: { opacity: 1, visibility: 'visible' },
        inactive: { opacity: 0, transitionEnd: { visibility: 'hidden' } }
      }}
      transition={{ duration: 0.6, ease: easing }}
      style={{ y, scale, pointerEvents: isActive ? 'auto' : 'none', zIndex: isActive ? 2 : 1 }}
    >
      {children}
    </motion.div>
  )
}

function StickyPanels({ kicker, title, description, cta, items, renderPanel, getLabel, mode = 'sticky' }) {
  const reducedMotion = usePrefersReducedMotion()
  const ref = useRef(null)
  const progressValue = useMotionValue(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (reducedMotion || mode === 'flow') {
      return
    }

    const update = () => {
      const element = ref.current
      if (!element) {
        return
      }
      const { y, viewport } = scrollStore.getState()
      const rect = element.getBoundingClientRect()
      const top = rect.top + y
      const height = rect.height
      const start = top - viewport
      const end = top + height
      const raw = (y - start) / (end - start)
      const clamped = Math.max(0, Math.min(1, raw))
      progressValue.set(clamped)
    }

    update()
    const unsubscribe = scrollStore.subscribe(update)
    window.addEventListener('resize', update)
    window.addEventListener('load', update)

    return () => {
      unsubscribe()
      window.removeEventListener('resize', update)
      window.removeEventListener('load', update)
    }
  }, [progressValue, reducedMotion])

  useMotionValueEvent(progressValue, 'change', (latest) => {
    if (reducedMotion || mode === 'flow') {
      return
    }
    const next = Math.min(items.length - 1, Math.max(0, Math.floor(latest * items.length + 0.0001)))
    setActive((prev) => (prev === next ? prev : next))
  })

  const progressWidth = useTransform(progressValue, [0, 1], ['0%', '100%'])

  if (reducedMotion || mode === 'flow') {
    return (
      <div className="grid gap-12 lg:grid-cols-[0.55fr_1fr]">
        <div className={cx('space-y-6', mode === 'flow' ? 'lg:sticky lg:top-24 self-start' : '')}>
          <div className="space-y-3">
            <Caption>{kicker}</Caption>
            <RevealText
              as="h2"
              text={title}
              className="font-display text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl"
            />
            <p className="text-sm leading-relaxed text-ink-700">{description}</p>
          </div>
          {cta ? (
            <Button href={cta.href} variant="ghost">
              {cta.label}
            </Button>
          ) : null}
        </div>
        <div className="space-y-6">
          {items.map((item, index) => (
            <RevealBlock key={item.title ?? index} delay={index * 0.05}>
              {renderPanel(item, index)}
            </RevealBlock>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} style={{ minHeight: `${items.length * 95}vh` }} className="relative">
      <div className="sticky top-24">
        <div className="grid gap-12 lg:grid-cols-[0.55fr_1fr]">
          <div className="space-y-8">
            <div className="space-y-3">
              <Caption>{kicker}</Caption>
              <RevealText
                as="h2"
                text={title}
                className="font-display text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl"
              />
              <p className="text-sm leading-relaxed text-ink-700">{description}</p>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.title ?? index}
                  className={cx(
                    'flex items-center justify-between border-b border-ink-900/10 pb-3 text-sm transition',
                    index === active ? 'text-ink-900' : 'text-ink-500'
                  )}
                >
                  <span className="font-medium">{getLabel ? getLabel(item, index) : item.title}</span>
                  <span className="text-xs uppercase tracking-[0.28em]">{String(index + 1).padStart(2, '0')}</span>
                </div>
              ))}
            </div>
            {cta ? (
              <Button href={cta.href} variant="ghost" className="w-fit">
                {cta.label}
              </Button>
            ) : null}
            <div className="h-px w-full bg-paper-200">
              <motion.div className="h-full bg-accent-400" style={{ width: progressWidth }} />
            </div>
          </div>
          <div className="relative min-h-[360px] md:min-h-[440px]">
            {items.map((item, index) => {
              return (
                <StickyPanel key={item.title ?? index} progressValue={progressValue} index={index} total={items.length} activeIndex={active}>
                  {renderPanel(item, index, active)}
                </StickyPanel>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function HomePage({ effectsEnabled = true }) {
  return (
    <main className="readable-ink">
      <Section id="hero" className="relative isolate pt-24 md:pt-30">
        <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
          <div className="absolute inset-0 bg-[radial-gradient(520px_380px_at_12%_18%,rgba(246,246,242,0.95),rgba(246,246,242,0.7)_58%,rgba(246,246,242,0)_78%),radial-gradient(520px_380px_at_86%_26%,rgba(246,246,242,0.95),rgba(246,246,242,0.65)_60%,rgba(246,246,242,0)_82%)] [mask-image:linear-gradient(to_bottom,black,black_70%,transparent)]" />
        </div>
        <Container className="relative z-10">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="min-w-0 space-y-10">
              <div className="space-y-6">
                <ScrambleText
                  as="p"
                  text="FULLSTACK РАЗРАБОТЧИК + 3D MOTION FRONTEND"
                  className="hero-kicker text-xs uppercase tracking-[0.36em] text-ink-500"
                  enabled={effectsEnabled}
                  trigger="mount"
                  duration={820}
                />
                <h1 className="hero-title font-display font-semibold text-ink-900">
                  <ScrambleText
                    as="span"
                    text="Собираю веб-продукты,"
                    className="block"
                    enabled={effectsEnabled}
                    trigger="mount"
                    duration={620}
                    startDelay={0}
                  />
                  <ScrambleText
                    as="span"
                    text="где надежный backend"
                    className="block"
                    enabled={effectsEnabled}
                    trigger="mount"
                    duration={620}
                    startDelay={70}
                  />
                  <ScrambleText
                    as="span"
                    text="встречается с выразительным"
                    className="block"
                    enabled={effectsEnabled}
                    trigger="mount"
                    duration={620}
                    startDelay={140}
                  />
                  <ScrambleText
                    as="span"
                    text="3D motion интерфейсом."
                    className="block text-accent-500"
                    enabled={effectsEnabled}
                    trigger="mount"
                    duration={640}
                    startDelay={210}
                  />
                </h1>
                <RevealText
                  as="p"
                  lines={[
                    '4+ года коммерческого опыта: Go, PHP, React, микросервисы и SSR/SPA.',
                    'Делаю архитектуру, интеграции и визуальную часть в одном контуре, чтобы релиз был быстрым и предсказуемым.'
                  ]}
                  className="text-base leading-relaxed text-ink-700"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="#contact">Связаться</Button>
                <Button href="#work" variant="ghost">
                  Смотреть опыт
                </Button>
              </div>
              <RevealGrid className="sm:grid-cols-3">
                <div className="rounded-2xl border border-ink-900/10 bg-paper-50 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-ink-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-900/25" />
                    <span>Фокус</span>
                  </div>
                  <div className="mt-2 text-lg font-semibold text-ink-900">3D motion + fullstack</div>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-paper-50 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-ink-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-900/25" />
                    <span>Стек</span>
                  </div>
                  <div className="mt-2 text-lg font-semibold text-ink-900">Go, PHP, React + Three.js/R3F</div>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-paper-50 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-ink-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-900/25" />
                    <span>Исполнение</span>
                  </div>
                  <div className="mt-2 text-lg font-semibold text-ink-900">От API до production</div>
                </div>
              </RevealGrid>
            </div>
            <div className="min-w-0 space-y-6">
              <RevealBlock className="rounded-3xl border border-ink-900/5 bg-white/75 p-6 backdrop-blur-md shadow-soft">
                <div className="text-xs uppercase tracking-[0.3em] text-ink-500">Кратко обо мне</div>
                <p className="mt-4 text-lg font-semibold leading-snug text-ink-900">
                  Fullstack-инженер из Казани. Проектирую архитектуру и добавляю 3D motion там, где он усиливает продукт, а не мешает ему.
                </p>
                <div className="mt-6 grid gap-3 text-xs uppercase tracking-[0.24em] text-ink-500">
                  <div className="flex items-center justify-between">
                    <span>Локация</span>
                    <span className="text-ink-700">Казань / удаленно</span>
                  </div>
                </div>
              </RevealBlock>
              <Parallax offset={60} className="rounded-3xl border border-ink-900/5 bg-white/70 p-6 backdrop-blur-md shadow-soft">
                <div className="text-xs uppercase tracking-[0.3em] text-ink-500">Как я работаю</div>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-900/85">
                  <p>Беру ответственность за весь цикл: аналитика, архитектура, код, тесты, деплой и поддержка.</p>
                  <p>3D и анимацию внедряю осознанно: от подготовки ассетов в Blender до оптимизированного рендера с контролем FPS и доступности.</p>
                </div>
              </Parallax>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="about">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.6fr_1fr]">
            <div className="space-y-4">
              <Caption>Обо мне</Caption>
              <ScrambleText
                as="h2"
                text="Middle Fullstack Developer с уклоном в 3D motion дизайн."
                className="font-display text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl"
                enabled={effectsEnabled}
                trigger="view"
                duration={780}
                viewThreshold={0.35}
              />
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-ink-700">
              <RevealBlock>
                <p>
                  Проектирую и реализую внутренние и клиентские сервисы на Go/PHP/JS: от архитектуры и API до
                  интерфейса и релиза. Фокус — системы, которые помогают бизнесу быстрее принимать решения и меньше
                  терять на ручных операциях.
                </p>
              </RevealBlock>
              <RevealBlock delay={0.1}>
                <p>
                  Реализовывал продуктовые контуры разного класса: промо-платформы с проверкой чеков, realtime-аукцион,
                  legacy-логистику, а также систему транспортной диспетчеризации с нуля.
                </p>
              </RevealBlock>
              <RevealBlock delay={0.14}>
                <div className="rounded-2xl border border-accent-300/40 bg-white/70 p-5 backdrop-blur-sm">
                  <div className="text-xs uppercase tracking-[0.28em] text-ink-500">Бизнес-задачи, которые закрываю</div>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-700">
                    <li>Автоматизация диспетчерской работы: статусы перевозок, задержки, таймлайн событий, контроль операций.</li>
                    <li>Монетизация и продажи: аукционные ставки в реальном времени, подтверждение сделок, управление лотами.</li>
                    <li>Промо-механики: личный кабинет, регистрация документов, валидация, дедупликация и модерация.</li>
                    <li>Устойчивость legacy: безопасный рефакторинг, интеграции с внешними системами и сохранение бизнес-непрерывности.</li>
                  </ul>
                </div>
              </RevealBlock>
              <RevealBlock delay={0.15}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-accent-300/40 bg-white/70 p-5 backdrop-blur-sm">
                    <div className="text-xs uppercase tracking-[0.28em] text-ink-500">3D стек</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {threeStack.map((item) => (
                        <span key={item} className="rounded-full border border-ink-900/10 bg-paper-50 px-3 py-1 text-xs font-medium text-ink-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-ink-900/10 bg-white/70 p-5 backdrop-blur-sm">
                    <div className="text-xs uppercase tracking-[0.28em] text-ink-500">Дизайн-стек</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {designStack.map((item) => (
                        <span key={item} className="rounded-full border border-ink-900/10 bg-paper-50 px-3 py-1 text-xs font-medium text-ink-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealBlock>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="services">
        <Container>
          <FlowPanels
            kicker="Услуги"
            title="Решаю задачи от API до 3D-интерфейса."
            description="Берусь за продукт целиком или усиливаю конкретный блок: backend, frontend, motion и инфраструктуру."
            cta={{ label: 'Обсудить задачу', href: '#contact' }}
            effectsEnabled={effectsEnabled}
            items={services}
            renderPanel={(service, index) => (
              <div className="flex h-full flex-col justify-between rounded-3xl border border-white/22 bg-ink-900/60 p-8 shadow-soft backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.32em] text-white/72">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-white/86">{service.description}</p>
                </div>
                <div className="mt-8 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/68">
                  <span>Результат</span>
                  <span>Рабочий релиз</span>
                </div>
              </div>
            )}
          />
        </Container>
      </Section>

      <Section id="work">
        <Container>
          <div className="space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="space-y-3">
                <Caption>Избранные работы</Caption>
                <ScrambleText
                  as="h2"
                  text="Коммерческий опыт и типовые задачи, которые я закрываю."
                  className="font-display text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl"
                  enabled={effectsEnabled}
                  trigger="view"
                  duration={860}
                  viewThreshold={0.35}
                />
              </div>
              <Button href="#contact" variant="ghost">
                Запросить детали
              </Button>
            </div>
            <Parallax offset={40} className="h-px w-full bg-gradient-to-r from-transparent via-ink-900/30 to-transparent" />
            <RevealGrid className="md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <WorkCard key={project.title} project={project} />
              ))}
            </RevealGrid>
          </div>
        </Container>
      </Section>

      <Section id="values">
        <Container>
          <FlowPanels
            kicker="Принципы"
            title="Подход, который снижает риски и ускоряет delivery."
            description="Фокус на прозрачности процесса, контроле качества и устойчивой архитектуре."
            effectsEnabled={effectsEnabled}
            items={values}
            renderPanel={(value, index) => (
              <div className="flex h-full flex-col justify-between rounded-3xl border border-white/22 bg-ink-900/60 p-8 shadow-soft backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.32em] text-white/72">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-white/86">{value.description}</p>
                </div>
                <div className="mt-8 text-xs uppercase tracking-[0.28em] text-white/68">Применяю в каждом проекте</div>
              </div>
            )}
          />
        </Container>
      </Section>

      <Section id="contact" className="pb-26">
        <Container>
          <div className="space-y-8">
            <div className="space-y-3">
              <Caption>Контакты</Caption>
              <ScrambleText
                as="h2"
                text="Открыт к сильным fullstack и 3D motion задачам."
                className="font-display text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl"
                enabled={effectsEnabled}
                trigger="view"
                duration={760}
                viewThreshold={0.35}
              />
              <p className="text-sm leading-relaxed text-ink-700">
                Напиши в Telegram или на почту. Отвечаю быстро, можно сразу с ТЗ и сроками.
              </p>
            </div>
            <RevealGrid className="md:grid-cols-3">
              {contacts.map((contact) => (
                <ContactBlock key={contact.label} label={contact.label} value={contact.value} href={contact.href} />
              ))}
            </RevealGrid>
            <Divider />
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.28em] text-white/72">
              <span>Работаю по всему миру</span>
              <span>© 2026 ST Celestial</span>
            </div>
            <div className="space-y-1 text-[10px] leading-relaxed text-white/58">
              {modelCredits.map((credit) => (
                <p key={credit.title}>
                  <a href={credit.modelUrl} target="_blank" rel="noreferrer noopener" className="hover:text-white/88">
                    "{credit.title}"
                  </a>{' '}
                  by{' '}
                  <a href={credit.authorUrl} target="_blank" rel="noreferrer noopener" className="hover:text-white/88">
                    {credit.author}
                  </a>{' '}
                  is licensed under{' '}
                  <a href={ccByUrl} target="_blank" rel="noreferrer noopener" className="hover:text-white/88">
                    Creative Commons Attribution
                  </a>
                  .
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
