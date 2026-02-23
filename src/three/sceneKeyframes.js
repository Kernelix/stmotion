export const sceneKeyframes = [
  {
    id: 'hero',
    label: 'Hero',
    cameraPosition: [0.1, 0.32, 4.6],
    target: [0, 0.08, 0],
    monolith: { pos: [-2.05, -0.22, 0.35], rot: [0.08, 0.2, 0], scale: 1.16, energy: 0.74 },
    orbs: { pos: [2.2, 0.28, 0.76], rot: [0.16, 0.2, 0], scale: 1.02, energy: 0.56 },
    light: { intensity: 1.22, color: '#9cc0ff' }
  },
  {
    id: 'about',
    label: 'About',
    cameraPosition: [0.25, 0.34, 5.25],
    target: [0.1, 0.1, -0.08],
    monolith: { pos: [-1.95, -0.24, 0.2], rot: [0.12, -0.05, 0.03], scale: 1.02, energy: 0.5 },
    orbs: { pos: [2.35, 0.24, 0.95], rot: [0.26, 0.05, 0.04], scale: 1.06, energy: 0.63 },
    light: { intensity: 1.08, color: '#8eb8ff' }
  },
  {
    id: 'services',
    label: 'Services',
    cameraPosition: [0.6, 0.22, 5],
    target: [0.3, 0.02, -0.2],
    monolith: { pos: [-1.75, -0.3, 0.45], rot: [0.1, 0.38, -0.04], scale: 1.05, energy: 0.62 },
    orbs: { pos: [1.7, 0.2, 0.45], rot: [0.18, 0.62, -0.05], scale: 0.82, energy: 0.86 },
    light: { intensity: 1.18, color: '#7ca9ff' }
  },
  {
    id: 'work',
    label: 'Work',
    cameraPosition: [-0.45, 0.44, 5.4],
    target: [0, 0.04, -0.14],
    monolith: { pos: [-2.2, -0.46, 0.18], rot: [0.21, 0.82, 0.05], scale: 0.98, energy: 0.58 },
    orbs: { pos: [2.05, 0.12, 1.05], rot: [0.3, 0.85, 0.06], scale: 1.12, energy: 0.78 },
    light: { intensity: 1.04, color: '#a6c1ff' }
  },
  {
    id: 'values',
    label: 'Values',
    cameraPosition: [0.08, 0.28, 5.15],
    target: [0.04, 0.07, -0.05],
    monolith: { pos: [-1.98, -0.26, 0.24], rot: [0.09, 1.1, 0.01], scale: 1, energy: 0.42 },
    orbs: { pos: [2.2, 0.2, 0.68], rot: [0.15, 1.08, -0.02], scale: 0.95, energy: 0.5 },
    light: { intensity: 0.92, color: '#d1dfff' }
  },
  {
    id: 'contact',
    label: 'Contact',
    cameraPosition: [0, 0.22, 5.35],
    target: [0, 0, -0.12],
    monolith: { pos: [-2.02, -0.28, 0.2], rot: [0.05, 1.4, 0], scale: 0.92, energy: 0.24 },
    orbs: { pos: [2.12, 0.08, 0.9], rot: [0.08, 1.42, 0], scale: 0.84, energy: 0.28 },
    light: { intensity: 0.78, color: '#e7edf7' }
  }
]

export const sceneSectionIds = sceneKeyframes.map((scene) => scene.id)
