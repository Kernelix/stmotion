const baseUrl = import.meta.env.BASE_URL || '/'

const withBase = (path) => `${baseUrl}${path.replace(/^\//, '')}`

export const modelPaths = {
  monolith: withBase('models/model-1-monolith.glb'),
  ribbon: withBase('models/model-2-ribbon.glb'),
  orb: withBase('models/model-3-orbcluster.glb')
}

export const modelPathList = [modelPaths.monolith, modelPaths.ribbon, modelPaths.orb]
