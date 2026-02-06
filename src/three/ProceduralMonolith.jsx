import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, MathUtils } from 'three'
import { modelStages } from '@/three/sceneStages'
import { getPose } from '@/three/poseUtils'

export function ProceduralMonolith({ scrollRef, pointerRef, intensity = 1 }) {
  const mesh = useRef(null)
  const baseColor = useMemo(() => new Color('#f6f5f0'), [])
  const accentColor = useMemo(() => new Color('#2b7cff'), [])
  const baseEmissive = useMemo(() => new Color('#050505'), [])

  useFrame((state, delta) => {
    if (!mesh.current) {
      return
    }
    const { index, t, progress } = scrollRef.current
    const pose = getPose(modelStages.monolith, index, t)
    const pointer = pointerRef.current
    const float = (progress - 0.5) * 0.12 * intensity
    const targetRotationX = pose.rotation[0] + pointer.y * 0.1 * intensity
    const targetRotationY = pose.rotation[1] + pointer.x * 0.12 * intensity
    const targetRotationZ = pose.rotation[2]
    let needsUpdate = false

    if (intensity === 0) {
      mesh.current.position.set(pose.position[0], pose.position[1] + float, pose.position[2])
      mesh.current.rotation.set(targetRotationX, targetRotationY, targetRotationZ)
      mesh.current.scale.setScalar(pose.scale)
    } else {
      mesh.current.position.x = MathUtils.damp(mesh.current.position.x, pose.position[0], 4, delta)
      mesh.current.position.y = MathUtils.damp(mesh.current.position.y, pose.position[1] + float, 4, delta)
      mesh.current.position.z = MathUtils.damp(mesh.current.position.z, pose.position[2], 4, delta)

      mesh.current.rotation.x = MathUtils.damp(mesh.current.rotation.x, targetRotationX, 4, delta)
      mesh.current.rotation.y = MathUtils.damp(mesh.current.rotation.y, targetRotationY, 4, delta)
      mesh.current.rotation.z = MathUtils.damp(mesh.current.rotation.z, targetRotationZ, 4, delta)

      const scale = MathUtils.damp(mesh.current.scale.x, pose.scale, 4, delta)
      mesh.current.scale.setScalar(scale)

      needsUpdate =
        Math.abs(mesh.current.position.x - pose.position[0]) > 0.0005 ||
        Math.abs(mesh.current.position.y - (pose.position[1] + float)) > 0.0005 ||
        Math.abs(mesh.current.position.z - pose.position[2]) > 0.0005 ||
        Math.abs(mesh.current.rotation.x - targetRotationX) > 0.0005 ||
        Math.abs(mesh.current.rotation.y - targetRotationY) > 0.0005 ||
        Math.abs(mesh.current.rotation.z - targetRotationZ) > 0.0005 ||
        Math.abs(mesh.current.scale.x - pose.scale) > 0.0005
    }

    const energy = pose.energy * intensity
    const material = mesh.current.material
    material.color.copy(baseColor).lerp(accentColor, energy * 0.2)
    material.emissive.copy(baseEmissive).lerp(accentColor, 0.4 + energy * 0.6)
    material.emissiveIntensity = 0.35 + energy * 1.6
    material.roughness = MathUtils.lerp(0.24, 0.16, energy)
    material.metalness = MathUtils.lerp(0.78, 0.95, energy)
    material.clearcoat = 0.75 + energy * 0.2
    material.clearcoatRoughness = 0.24 - energy * 0.12

    if (intensity > 0 && needsUpdate) {
      state.invalidate()
    }
  })

  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <boxGeometry args={[1.1, 3.1, 0.9]} />
      <meshPhysicalMaterial
        color="#f6f5f0"
        roughness={0.24}
        metalness={0.78}
        clearcoat={0.75}
        clearcoatRoughness={0.24}
        emissive="#050505"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}
