import { modelPathList } from '@/three/modelPaths.js'

const VALID_THREE_MODES = new Set(['full', 'lite', 'static'])
const rawForceMode = (import.meta.env.VITE_THREE_FORCE_MODE ?? '').toLowerCase().trim()

export const threeConfig = {
  useModels: true,
  autoDetectModels: false,
  forceMode: VALID_THREE_MODES.has(rawForceMode) ? rawForceMode : null,
  debug: false,
  modelPaths: modelPathList
}
