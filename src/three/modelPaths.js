const baseUrl = import.meta.env.BASE_URL || '/'

const withBase = (path) => `${baseUrl}${path.replace(/^\//, '')}`

export const modelPaths = {
  monolith: withBase('models/model-1-plasma.glb'),
  ribbon: withBase('models/model-2-robot.glb'),
  orb: withBase('models/model-3-space-voyage.glb')
}

export const modelPathList = [modelPaths.monolith, modelPaths.ribbon, modelPaths.orb]
