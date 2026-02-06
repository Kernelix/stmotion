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
import { projects } from '@/content/projects'
import { services } from '@/content/services'
import { values } from '@/content/values'
import { contacts } from '@/content/contact'
import { usePrefersReducedMotion } from '@/hooks'
import { scrollStore } from '@/lib/scrollStore'
import { cx } from '@/lib/cx'

const easing = [0.22, 1, 0.36, 1]

function FlowPanels({ kicker, title, description, cta, items, renderPanel }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[0.55fr_1fr]">
      <div className="space-y-6 lg:sticky lg:top-24 self-start">
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

export function HomePage() {
  return (
    <main>
      <Section id="hero" className="pt-24 md:pt-30">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-10">
              <div className="space-y-6">
                <RevealText
                  as="p"
                  text="Fullstack разработчик + дизайнер"
                  className="text-xs uppercase tracking-[0.36em] text-ink-500"
                />
                <RevealText
                  as="h1"
                  text="Премиальные цифровые продукты с редакционной ясностью и иммерсивными 3D-системами."
                  highlightWords={['3D']}
                  highlightClassName="text-accent-500"
                  className="font-display text-5xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-6xl md:text-7xl"
                />
                <RevealText
                  as="p"
                  lines={[
                    'Проектирую и собираю высокопроизводительные цифровые продукты для амбициозных команд.',
                    'От продуктового нарратива до фронтенд-архитектуры — каждая деталь настроена на доверие и скорость.'
                  ]}
                  className="text-base leading-relaxed text-ink-700"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="#contact">Начать проект</Button>
                <Button href="#work" variant="ghost">
                  Посмотреть работы
                </Button>
              </div>
              <RevealGrid className="sm:grid-cols-3">
                <div className="rounded-2xl border border-ink-900/10 bg-paper-50 p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-ink-500">Фокус</div>
                  <div className="mt-2 text-lg font-semibold text-ink-900">Бренд + продукт</div>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-paper-50 p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-ink-500">Стек</div>
                  <div className="mt-2 text-lg font-semibold text-ink-900">React, WebGL, JS</div>
                </div>
                <div className="rounded-2xl border border-ink-900/10 bg-paper-50 p-4">
                  <div className="text-xs uppercase tracking-[0.28em] text-ink-500">Исполнение</div>
                  <div className="mt-2 text-lg font-semibold text-ink-900">Дизайн + разработка</div>
                </div>
              </RevealGrid>
            </div>
            <div className="space-y-6">
              <RevealBlock className="rounded-3xl border border-ink-900/10 bg-paper-50 p-6 shadow-soft">
                <div className="text-xs uppercase tracking-[0.32em] text-ink-500">Заметки студии</div>
                <p className="mt-4 text-lg font-semibold text-ink-900">
                  Редакционные сетки, скульптурная анимация и глубина реального времени без потери производительности.
                </p>
                <div className="mt-6 grid gap-4 text-xs uppercase tracking-[0.28em] text-ink-500">
                  <div className="flex items-center justify-between">
                    <span>Локация</span>
                    <span>Удаленно / глобально</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Доступность</span>
                    <span>Бронирование Q2 2026</span>
                  </div>
                </div>
              </RevealBlock>
              <Parallax offset={60} className="rounded-3xl border border-ink-900/10 bg-paper-50/80 p-6">
                <div className="text-xs uppercase tracking-[0.32em] text-ink-500">Фирменный подход</div>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
                  <p>Продуктовая стратегия, UX-системы и интерактивный сторителлинг от начала до конца.</p>
                  <p>Каждая сборка настроена на ясность, отзывчивость и премиальное тактильное ощущение.</p>
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
              <RevealText
                as="h2"
                lines={['Разработчик, который проектирует,', 'дизайнер, который доводит до релиза.']}
                className="font-display text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl"
              />
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-ink-700">
              <RevealBlock>
                <p>
                  Я работаю с фаундерами и продуктовыми командами, создавая премиальные цифровые впечатления. Моя
                  практика соединяет продуктовую стратегию, визуальные системы и инженерию, чтобы сохранять
                  дизайн-замысел от концепта до продакшена.
                </p>
              </RevealBlock>
              <RevealBlock delay={0.1}>
                <p>
                  Последние коллаборации — от ИИ-инструментов до культурных платформ и кураторской коммерции. Мне
                  комфортно там, где пересекаются бренд, интерфейс и технологии реального времени.
                </p>
              </RevealBlock>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="services">
        <Container>
          <FlowPanels
            kicker="Услуги"
            title="Полный спектр продуктовой разработки."
            description="Стратегия, дизайн и инженерия как единая система. Каждый этап замыкается в следующий."
            cta={{ label: 'Запросить объем и сроки', href: '#contact' }}
            items={services}
            renderPanel={(service, index) => (
              <div className="flex h-full flex-col justify-between rounded-3xl border border-ink-900/10 bg-paper-50 p-8 shadow-soft">
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.32em] text-ink-500">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-2xl font-semibold text-ink-900">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-700">{service.description}</p>
                </div>
                <div className="mt-8 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-ink-500">
                  <span>Результат</span>
                  <span>Точная сборка</span>
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
                <RevealText
                  as="h2"
                  text="Иммерсивно, редакционно, с приоритетом производительности."
                  className="font-display text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl"
                />
              </div>
              <Button href="#contact" variant="ghost">
                Запросить кейс
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
            title="Принципы, которые удерживают работу на премиальном уровне."
            description="Ясность, производительность и тактильная детализация ведут каждое решение."
            items={values}
            renderPanel={(value, index) => (
              <div className="flex h-full flex-col justify-between rounded-3xl border border-ink-900/10 bg-paper-50 p-8 shadow-soft">
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.32em] text-ink-500">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-2xl font-semibold text-ink-900">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-700">{value.description}</p>
                </div>
                <div className="mt-8 text-xs uppercase tracking-[0.28em] text-ink-500">Всегда в работе</div>
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
              <RevealText
                as="h2"
                text="Давайте выпустим то, чем можно гордиться."
                className="font-display text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl"
              />
              <p className="text-sm leading-relaxed text-ink-700">
                Пришлите бриф, сроки или просто скажите привет. Отвечаю в течение 48 часов.
              </p>
            </div>
            <RevealGrid className="md:grid-cols-3">
              {contacts.map((contact) => (
                <ContactBlock key={contact.label} label={contact.label} value={contact.value} href={contact.href} />
              ))}
            </RevealGrid>
            <Divider />
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.28em] text-ink-500">
              <span>Работаю по всему миру</span>
              <span>© 2026 ST Celestial Motion Studio</span>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
