# ST Celestial Motion Studio Portfolio

Премиальный одностраничный landing/portfolio для fullstack developer + designer с in‑page 3D и скролл‑монтажом.

## Быстрый старт

```bash
cd stmotion
pnpm install
pnpm dev
```

Рабочая команда локального запуска:

```bash
cd stmotion && pnpm install && pnpm dev
```

Команды:

- `pnpm dev` — локальный dev-сервер
- `pnpm build` — production build
- `pnpm preview` — локальный предпросмотр build
- `pnpm test` — тесты
- `pnpm lint` — линтинг

## Где менять контент

- `src/content/projects.js`
- `src/content/services.js`
- `src/content/values.js`
- `src/content/contact.js`

## Motion эффекты

Использовано:

- Плавные входы секций (fade‑in) — `src/components/Section.jsx`
- Word/line‑reveal текста — `src/components/RevealText.jsx`
- Clip‑reveal карточек/блоков — `src/components/RevealBlock.jsx`
- Stagger + лёгкий depth для сеток — `src/components/RevealGrid.jsx`
- Параллакс внутри секций — `src/components/Parallax.jsx`
- Микро‑hover: lift/underline — `src/components/Button.jsx`, `src/components/Link.jsx`, `src/components/WorkCard.jsx`, `src/components/ContactBlock.jsx`
- Scroll‑progress бар — `src/components/ScrollProgress.jsx`
- 3D pointer‑parallax и scroll‑синхронизация — `src/three/ThreeScene.jsx`

prefers‑reduced‑motion поддержан: анимации упрощаются или отключаются.

## Конструктор‑скролл

Структура «сайт как конструктор» реализована в:

- `src/components/Section.jsx` — монтажный вход/выход секций.
- `src/components/RevealText.jsx` — word/line‑reveal текста.
- `src/components/RevealBlock.jsx` — clip‑reveal блоков.
- `src/components/RevealGrid.jsx` — stagger + depth для сеток.
- `src/pages/HomePage.jsx` — сценарные блоки Services/Values в колонках.

## 3D сцена и синхронизация

- `src/three/ThreeScene.jsx` — full‑bleed Canvas, pointer‑parallax, scroll‑синхронизация.
- `src/three/sceneStages.js` — ключевые позы для секций и моделей.
- `src/three/ModelScene.jsx` — GLB сцена с адаптивной подсветкой.
- `src/three/Procedural*` — процедурный fallback.
- `src/lib/scrollStore.js` — безопасный scroll‑progress без hijack.

Режимы и флаги:

- `src/content/config.js` — настройки рендера и пути моделей.

## GLB модели

Модели по умолчанию лежат в `public/models`:

- `public/models/model-1-plasma.glb`
- `public/models/model-2-robot.glb`
- `public/models/model-3-space-voyage.glb`
