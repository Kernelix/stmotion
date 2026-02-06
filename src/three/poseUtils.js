export const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max)

export const lerp = (start, end, t) => start + (end - start) * t

export const lerp3 = (start, end, t) => start.map((value, index) => lerp(value, end[index], t))

export const getPose = (stages, index, t) => {
  const current = stages[index] ?? stages[0]
  const next = stages[index + 1] ?? current
  return {
    position: lerp3(current.position, next.position, t),
    rotation: lerp3(current.rotation, next.rotation, t),
    scale: lerp(current.scale, next.scale, t),
    energy: lerp(current.energy ?? 0, next.energy ?? current.energy ?? 0, t)
  }
}
