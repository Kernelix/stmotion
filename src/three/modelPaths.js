const baseUrl = import.meta.env.BASE_URL || '/'

const withBase = (path) => `${baseUrl}${path.replace(/^\//, '')}`

export const modelPaths = {
  monolith: withBase('models/model-1-plasma.glb'),
  ionDrive: withBase('models/model-2-ion-drive.glb'),
  orb: withBase('models/model-3-space-voyage.glb')
}

export const modelPathList = [modelPaths.monolith, modelPaths.ionDrive, modelPaths.orb]
