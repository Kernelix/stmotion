import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { Color, IcosahedronGeometry, MathUtils, MeshPhysicalMaterial, Object3D, Vector3 } from 'three'
import { modelStages } from '@/three/sceneStages'
import { getPose } from '@/three/poseUtils'

export function ProceduralOrbCluster({ scrollRef, pointerRef, intensity = 1 }) {
  const mesh = useRef(null)
  const baseColor = useMemo(() => new Color('#f6f5f0'), [])
  const accentColor = useMemo(() => new Color('#9cc0ff'), [])
  const baseEmissive = useMemo(() => new Color('#050505'), [])

  const { positions, scales } = useMemo(() => {
    const count = 18
    const pos = []
    const scl = []
    for (let i = 0; i < count; i += 1) {
      const radius = 0.6 + Math.random() * 0.7
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      pos.push(
        new Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        )
      )
      scl.push(0.14 + Math.random() * 0.18)
    }
    return { positions: pos, scales: scl }
  }, [])

  const geometry = useMemo(() => new IcosahedronGeometry(1, 0), [])
  const material = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: '#f4f2f7',
        roughness: 0.3,
        metalness: 0.6,
        clearcoat: 0.7
      }),
    []
  )

  useEffect(() => {
    if (!mesh.current) {
      return
    }
    const dummy = new Object3D()
    positions.forEach((position, index) => {
      dummy.position.copy(position)
      dummy.scale.setScalar(scales[index])
      dummy.updateMatrix()
      mesh.current?.setMatrixAt(index, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  }, [positions, scales])

  useFrame((state, delta) => {
    if (!mesh.current) {
      return
    }
    const { index, t, progress } = scrollRef.current
    const pose = getPose(modelStages.orb, index, t)
    const pointer = pointerRef.current
    const float = (progress - 0.5) * 0.1 * intensity
    const targetRotationX = pose.rotation[0] + pointer.y * 0.1 * intensity
    const targetRotationY = pose.rotation[1] + pointer.x * 0.16 * intensity
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
    material.roughness = MathUtils.lerp(0.3, 0.16, energy)
    material.metalness = MathUtils.lerp(0.6, 0.95, energy)
    material.clearcoat = 0.75 + energy * 0.2
    material.clearcoatRoughness = 0.24 - energy * 0.12

    if (intensity > 0 && needsUpdate) {
      state.invalidate()
    }
  })

  return <instancedMesh ref={mesh} args={[geometry, material, positions.length]} />
}
