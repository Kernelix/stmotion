import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  Box3,
  Color,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  MeshPhysicalMaterial,
  Vector3
} from 'three'
import { modelStages } from '@/three/sceneStages'
import { getPose } from '@/three/poseUtils'
import { modelPaths } from '@/three/modelPaths.js'
import { useMediaQuery } from '@/hooks'

const models = [
  {
    key: 'monolith',
    url: modelPaths.monolith,
    accent: '#2b7cff',
    stages: modelStages.monolith
  },
  {
    key: 'ribbon',
    url: modelPaths.ribbon,
    accent: '#4b91ff',
    stages: modelStages.ribbon
  },
  {
    key: 'orb',
    url: modelPaths.orb,
    accent: '#9cc0ff',
    stages: modelStages.orb
  }
]

function InteractiveModel({ url, accent, stages, scrollRef, pointerRef, intensity, layoutTuning, modelKey, motionTuning }) {
  const { invalidate } = useThree()
  const { scene } = useGLTF(url)
  const group = useRef(null)
  const materials = useRef([])
  const lineMaterials = useRef([])
  const baseScale = useRef(1)
  const prevProgress = useRef(0)
  const scrollImpulse = useRef(0)

  const accentColor = useMemo(() => new Color(accent), [accent])
  const baseColor = useMemo(() => new Color('#f6f5f0'), [])
  const clone = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    materials.current = []
    lineMaterials.current = []
    clone.traverse((child) => {
      if (!child.isMesh) {
        return
      }
      child.castShadow = true
      child.receiveShadow = true
      const material = new MeshPhysicalMaterial({
        color: baseColor,
        roughness: 0.24,
        metalness: 0.86,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
      })
      child.material = material
      materials.current.push({
        material,
        baseEmissive: new Color('#050505'),
        roughness: material.roughness,
        metalness: material.metalness,
        color: material.color.clone()
      })

      const edges = new EdgesGeometry(child.geometry, 35)
      const lineMaterial = new LineBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.18
      })
      const lines = new LineSegments(edges, lineMaterial)
      lines.scale.setScalar(1.001)
      child.add(lines)
      lineMaterials.current.push(lineMaterial)
    })
    const box = new Box3().setFromObject(clone)
    const size = new Vector3()
    const center = new Vector3()
    box.getSize(size)
    box.getCenter(center)
    const max = Math.max(size.x, size.y, size.z) || 1
    baseScale.current = 2.1 / max
    clone.position.sub(center)
    invalidate()
  }, [clone])

  useFrame((state, delta) => {
    if (!group.current) {
      return
    }

    const { index, t, progress } = scrollRef.current
    const pose = getPose(stages, index, t)
    const pointer = pointerRef.current
    const progressDelta = progress - prevProgress.current
    prevProgress.current = progress
    const rawImpulse = MathUtils.clamp(progressDelta * (motionTuning?.scrollSensitivity ?? 0), -0.22, 0.22)
    scrollImpulse.current = MathUtils.damp(scrollImpulse.current, rawImpulse, 14, delta)
    const scrollShiftY = scrollImpulse.current * (motionTuning?.scrollPosAmp ?? 0)
    const scrollShiftRotY = scrollImpulse.current * (motionTuning?.scrollRotAmp ?? 0)
    const elapsed = state.clock.elapsedTime
    const idleX = Math.sin(elapsed * (motionTuning?.idleFreqX ?? 0)) * (motionTuning?.idleAmpX ?? 0)
    const idleY = Math.cos(elapsed * (motionTuning?.idleFreqY ?? 0)) * (motionTuning?.idleAmpY ?? 0)
    const pointerX = (pointer.x + idleX) * (motionTuning?.pointerBoost ?? 1)
    const pointerY = (pointer.y + idleY) * (motionTuning?.pointerBoost ?? 1)
    const bob = Math.sin(elapsed * (motionTuning?.bobFreq ?? 0)) * (motionTuning?.bobAmp ?? 0)
    const float = (progress - 0.5) * 0.14 * intensity + bob
    const xFactor = layoutTuning?.xFactor ?? 1
    const yOffset = layoutTuning?.yOffset ?? 0
    const zOffset = layoutTuning?.zOffset ?? 0
    const perModel = layoutTuning?.perModel?.[modelKey] ?? { x: 0, y: 0, z: 0 }

    const poseX = pose.position[0] * xFactor + perModel.x
    const poseY = pose.position[1] + yOffset + perModel.y
    const poseZ = pose.position[2] + zOffset + perModel.z

    const targetPosition = [poseX, poseY + float + scrollShiftY, poseZ]
    const targetRotation = [
      pose.rotation[0] + pointerY * 0.16 * intensity,
      pose.rotation[1] + pointerX * 0.22 * intensity + scrollShiftRotY,
      pose.rotation[2]
    ]
    const targetScale = baseScale.current * pose.scale

    if (intensity === 0) {
      group.current.position.set(targetPosition[0], targetPosition[1], targetPosition[2])
      group.current.rotation.set(targetRotation[0], targetRotation[1], targetRotation[2])
      group.current.scale.setScalar(targetScale)
    } else {
      group.current.position.x = MathUtils.damp(group.current.position.x, targetPosition[0], 4, delta)
      group.current.position.y = MathUtils.damp(group.current.position.y, targetPosition[1], 4, delta)
      group.current.position.z = MathUtils.damp(group.current.position.z, targetPosition[2], 4, delta)

      group.current.rotation.x = MathUtils.damp(group.current.rotation.x, targetRotation[0], 4, delta)
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetRotation[1], 4, delta)
      group.current.rotation.z = MathUtils.damp(group.current.rotation.z, targetRotation[2], 4, delta)

      const scale = MathUtils.damp(group.current.scale.x, targetScale, 4, delta)
      group.current.scale.setScalar(scale)
    }

    const energy = pose.energy * intensity
    materials.current.forEach(({ material, baseEmissive, roughness, metalness, color }) => {
      material.color.copy(color).lerp(accentColor, energy * 0.2)
      material.emissive.copy(baseEmissive).lerp(accentColor, 0.4 + energy * 0.6)
      material.emissiveIntensity = 0.35 + energy * 1.6
      material.roughness = MathUtils.lerp(roughness, 0.16, energy)
      material.metalness = MathUtils.lerp(metalness, 0.95, energy)
      material.clearcoat = 0.7 + energy * 0.25
      material.clearcoatRoughness = 0.25 - energy * 0.12
    })
    lineMaterials.current.forEach((lineMaterial) => {
      lineMaterial.opacity = 0.18 + energy * 0.5
    })

    if (
      intensity > 0 &&
      (Math.abs(group.current.position.x - targetPosition[0]) > 0.0005 ||
        Math.abs(group.current.position.y - targetPosition[1]) > 0.0005 ||
        Math.abs(group.current.position.z - targetPosition[2]) > 0.0005 ||
        Math.abs(group.current.rotation.x - targetRotation[0]) > 0.0005 ||
        Math.abs(group.current.rotation.y - targetRotation[1]) > 0.0005 ||
        Math.abs(group.current.rotation.z - targetRotation[2]) > 0.0005 ||
        Math.abs(group.current.scale.x - targetScale) > 0.0005)
    ) {
      state.invalidate()
    }
  })

  return (
    <group ref={group}>
      <primitive object={clone} />
    </group>
  )
}

export function ModelScene({ scrollRef, pointerRef, intensity = 1, motionTuning }) {
  const { invalidate } = useThree()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isNarrowMobile = useMediaQuery('(max-width: 390px)')
  const layoutTuning = isNarrowMobile
    ? {
        xFactor: 0.72,
        yOffset: 0.02,
        zOffset: 0.04,
        perModel: {
          monolith: { x: -0.1, y: 0.02, z: 0.12 },
          ribbon: { x: 0, y: 0.01, z: -0.14 },
          orb: { x: 0.1, y: 0.02, z: 0.1 }
        }
      }
    : isMobile
      ? {
          xFactor: 0.78,
          yOffset: 0.01,
          zOffset: 0.02,
          perModel: {
            monolith: { x: -0.06, y: 0.01, z: 0.08 },
            ribbon: { x: 0, y: 0.01, z: -0.1 },
            orb: { x: 0.06, y: 0.01, z: 0.07 }
          }
        }
      : { xFactor: 1, yOffset: 0, zOffset: 0 }

  useEffect(() => {
    models.forEach((model) => {
      useGLTF.preload(model.url)
    })
    invalidate()
  }, [])

  return (
    <group>
      {models.map((model) => (
        <InteractiveModel
          key={model.key}
          url={model.url}
          accent={model.accent}
          stages={model.stages}
          scrollRef={scrollRef}
          pointerRef={pointerRef}
          intensity={intensity}
          layoutTuning={layoutTuning}
          modelKey={model.key}
          motionTuning={motionTuning}
        />
      ))}
    </group>
  )
}
