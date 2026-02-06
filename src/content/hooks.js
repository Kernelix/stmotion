export const hooks = [
  {
    id: 'useStableCallback',
    name: 'useStableCallback',
    description: 'Стабильная ссылка на функцию без пересоздания эффектов.',
    status: 'failed'
  },
  {
    id: 'useEventListener',
    name: 'useEventListener',
    description: 'Декларативное управление слушателями событий с корректной отпиской.',
    status: 'failed'
  },
  {
    id: 'useMediaQuery',
    name: 'useMediaQuery',
    description: 'Реактивный матчинг медиазапросов для адаптивной логики.',
    status: 'passed'
  },
  {
    id: 'usePrefersReducedMotion',
    name: 'usePrefersReducedMotion',
    description: 'Хук предпочтения анимации для доступности.',
    status: 'passed'
  },
  {
    id: 'useIntersectionObserver',
    name: 'useIntersectionObserver',
    description: 'Отслеживание видимости вьюпорта для ленивых блоков.',
    status: 'failed'
  },
  {
    id: 'useDebouncedValue',
    name: 'useDebouncedValue',
    description: 'Дебаунс значений для дорогих операций.',
    status: 'passed'
  },
  {
    id: 'useLocalStorageState',
    name: 'useLocalStorageState',
    description: 'Состояние в localStorage с безопасной гидратацией.',
    status: 'failed'
  },
  {
    id: 'useScrollProgress',
    name: 'useScrollProgress',
    description: 'Легкий прогресс скролла для редакционных подсказок.',
    status: 'passed'
  }
]
