# ST Celestial Motion Studio Portfolio

Премиальный одностраничный landing/portfolio для fullstack developer + designer с in‑page 3D, скролл‑монтажом и Hook Gym.

## Быстрый старт

```bash
pnpm i
pnpm models:build
pnpm dev
```

Команды:

- `pnpm dev`
- `pnpm build`
- `pnpm preview`
- `pnpm test`
- `pnpm lint`
- `pnpm models:build`

## Где менять контент

- `src/content/projects.js`
- `src/content/services.js`
- `src/content/values.js`
- `src/content/contact.js`
- `src/content/hooks.js`

## Конструктор‑скролл

Структура «сайт как конструктор» реализована в:

- `src/components/Section.jsx` — монтажный вход/выход секций.
- `src/components/RevealText.jsx` — word/line‑reveal текста.
- `src/components/RevealBlock.jsx` — clip‑reveal блоков.
- `src/components/RevealGrid.jsx` — stagger + depth для сеток.
- `src/pages/HomePage.jsx` — sticky‑сценарии (Services + Values).

## 3D сцена и синхронизация

- `src/three/ThreeScene.jsx` — full‑bleed Canvas, pointer‑parallax, scroll‑синхронизация.
- `src/three/sceneStages.js` — ключевые позы для секций и моделей.
- `src/three/ModelScene.jsx` — GLB сцена с адаптивной подсветкой.
- `src/three/Procedural*` — процедурный fallback.

Режимы и флаги:

- `src/content/config.js` — авто‑детект GLB, режимы, пути.

## GLB модели и Blender

Модели по умолчанию лежат в `public/models`:

- `public/models/model-1-monolith.glb`
- `public/models/model-2-ribbon.glb`
- `public/models/model-3-orbcluster.glb`

Генерация через Blender (headless):

```bash
pnpm models:build
```

Скрипты:

- `tools/blender/monolith.py`
- `tools/blender/ribbon.py`
- `tools/blender/orb-cluster.py`

Blender должен быть доступен в PATH. При необходимости:

```bash
export BLENDER_PATH="/path/to/blender"
```

Если GLB отсутствуют, сцена автоматически использует процедурные модели.

## Hook Gym

Реализованные хуки проходят тесты, заглушки падают специально:

- Заглушки: `useStableCallback`, `useEventListener`, `useIntersectionObserver`, `useLocalStorageState`
- Реализованные: `useMediaQuery`, `usePrefersReducedMotion`, `useDebouncedValue`, `useScrollProgress`

Статусы отображаются в UI секции `Hook Gym`.
