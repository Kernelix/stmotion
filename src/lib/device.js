export function isLowEndDevice() {
  if (typeof navigator === 'undefined') {
    return false
  }
  const nav = navigator
  const memory = nav.deviceMemory ?? 8
  const cores = navigator.hardwareConcurrency ?? 8
  return memory <= 4 || cores <= 4
}
