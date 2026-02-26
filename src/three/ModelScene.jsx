import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import {
  AnimationMixer,
  Box3,
  Color,
  DoubleSide,
  NormalBlending,
  SRGBColorSpace,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
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
    stages: modelStages.monolith,
    colorMode: 'source',
    showEdges: false,
    animationSpeed: 1
  },
  {
    key: 'ionDrive',
    url: modelPaths.ionDrive,
    accent: '#6ea4ff',
    stages: modelStages.ionDrive,
    animationHint: 'main',
    scaleBoost: 1.12
  },
  {
    key: 'orb',
    url: modelPaths.orb,
    accent: '#9cc0ff',
    stages: modelStages.orb,
    scaleBoost: 1.91
  }
]

function InteractiveModel({
  url,
  accent,
  stages,
  animationHint,
  scaleBoost = 1,
  colorMode = 'default',
  showEdges = true,
  animationSpeed = 1,
  positionBoost = [0, 0, 0],
  scrollRef,
  pointerRef,
  intensity,
  layoutTuning,
  modelKey,
  motionTuning
}) {
  const { invalidate } = useThree()
  const { scene, animations } = useGLTF(url)
  const group = useRef(null)
  const materials = useRef([])
  const lineMaterials = useRef([])
  const edgeGeometries = useRef([])
  const mixerRef = useRef(null)
  const baseScale = useRef(1)
  const prevProgress = useRef(0)
  const scrollImpulse = useRef(0)

  const accentColor = useMemo(() => new Color(accent), [accent])
  const isSourceColor = colorMode === 'source'
  const isVivid = colorMode === 'vivid'
  const clone = useMemo(() => skeletonClone(scene), [scene])

  useEffect(() => {
    materials.current = []
    lineMaterials.current = []
    edgeGeometries.current = []
    if (mixerRef.current) {
      mixerRef.current.stopAllAction()
      mixerRef.current.uncacheRoot(clone)
      mixerRef.current = null
    }
    clone.traverse((child) => {
      if (!child.isMesh) {
        return
      }
      child.castShadow = true
      child.receiveShadow = true
      const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material]
      const clonedMaterials = sourceMaterials.map((material) => (material?.isMaterial ? material.clone() : material))
      child.material = Array.isArray(child.material) ? clonedMaterials : clonedMaterials[0]

      clonedMaterials.forEach((material) => {
        if (!material?.isMaterial) {
          return
        }

        if (isSourceColor && modelKey === 'monolith' && material.name === 'material') {
          material.transparent = true
          material.opacity = 1
          material.depthWrite = true
          material.side = DoubleSide
          material.alphaTest = 0.08
          material.blending = NormalBlending
          if (material.color) {
            material.color.setRGB(0.82, 0.86, 0.95)
          }
          if (material.emissive) {
            material.emissive.setRGB(0.38, 0.46, 0.68)
          }
          if (material.map) {
            material.emissiveMap = material.map
          }
          if (typeof material.emissiveIntensity === 'number') {
            material.emissiveIntensity = 0.58
          }
          if (typeof material.roughness === 'number') {
            material.roughness = 0.82
          }
          if (typeof material.metalness === 'number') {
            material.metalness = 0.02
          }
          if (typeof material.clearcoat === 'number') {
            material.clearcoat = 0
          }
          if (typeof material.clearcoatRoughness === 'number') {
            material.clearcoatRoughness = 1
          }
          if (material.map) {
            material.map.colorSpace = SRGBColorSpace
            material.map.needsUpdate = true
          }
          material.needsUpdate = true
        }

        materials.current.push({
          material,
          color: material.color ? material.color.clone() : null,
          emissive: material.emissive ? material.emissive.clone() : null,
          emissiveIntensity: typeof material.emissiveIntensity === 'number' ? material.emissiveIntensity : null,
          roughness: typeof material.roughness === 'number' ? material.roughness : null,
          metalness: typeof material.metalness === 'number' ? material.metalness : null,
          clearcoat: typeof material.clearcoat === 'number' ? material.clearcoat : null,
          clearcoatRoughness: typeof material.clearcoatRoughness === 'number' ? material.clearcoatRoughness : null
        })
      })

      if (showEdges) {
        const edges = new EdgesGeometry(child.geometry, 35)
        const lineMaterial = new LineBasicMaterial({
          color: accent,
          transparent: true,
          opacity: 0.18
        })
        const lines = new LineSegments(edges, lineMaterial)
        lines.scale.setScalar(1.001)
        child.add(lines)
        edgeGeometries.current.push(edges)
        lineMaterials.current.push(lineMaterial)
      }
    })

    if (animations.length) {
      const mixer = new AnimationMixer(clone)
      const normalizedHint = animationHint?.toLowerCase()
      const selectedClip =
        animations.find((clip) => normalizedHint && (clip.name || '').toLowerCase().includes(normalizedHint)) ?? animations[0]
      mixer.clipAction(selectedClip).reset().setEffectiveTimeScale(animationSpeed).play()
      mixerRef.current = mixer
    }

    const box = new Box3().setFromObject(clone)
    const size = new Vector3()
    const center = new Vector3()
    box.getSize(size)
    box.getCenter(center)
    const max = Math.max(size.x, size.y, size.z) || 1
    baseScale.current = 2.1 / max
    clone.position.sub(center)
    invalidate()
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction()
        mixerRef.current.uncacheRoot(clone)
        mixerRef.current = null
      }
      lineMaterials.current.forEach((material) => material.dispose())
      edgeGeometries.current.forEach((geometry) => geometry.dispose())
      materials.current.forEach(({ material }) => material.dispose?.())
      lineMaterials.current = []
      edgeGeometries.current = []
      materials.current = []
    }
  }, [animations, clone, accent, animationSpeed, invalidate, isSourceColor, modelKey, showEdges])

  useFrame((state, delta) => {
    if (!group.current) {
      return
    }

    if (mixerRef.current && intensity > 0) {
      mixerRef.current.update(delta)
      state.invalidate()
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
    const xOffset = layoutTuning?.xOffset ?? 0
    const sectionProgress = index + t
    const bottomXBias =
      typeof layoutTuning?.bottomXBias === 'number'
        ? MathUtils.smoothstep(sectionProgress, 3.6, 5) * layoutTuning.bottomXBias
        : 0
    const yOffset = layoutTuning?.yOffset ?? 0
    const zOffset = layoutTuning?.zOffset ?? 0
    const perModel = layoutTuning?.perModel?.[modelKey] ?? { x: 0, y: 0, z: 0, scale: 1 }

    const poseX = pose.position[0] * xFactor + xOffset + bottomXBias + perModel.x + (positionBoost[0] ?? 0)
    const poseY = pose.position[1] + yOffset + perModel.y + (positionBoost[1] ?? 0)
    const poseZ = pose.position[2] + zOffset + perModel.z + (positionBoost[2] ?? 0)

    const targetPosition = [poseX, poseY + float + scrollShiftY, poseZ]
    const targetRotation = [
      pose.rotation[0] + pointerY * 0.16 * intensity,
      pose.rotation[1] + pointerX * 0.22 * intensity + scrollShiftRotY,
      pose.rotation[2]
    ]
    const targetScale =
      baseScale.current * pose.scale * scaleBoost * (layoutTuning?.scaleFactor ?? 1) * (perModel.scale ?? 1)

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
    materials.current.forEach(
      ({
        material,
        color,
        emissive,
        emissiveIntensity,
        roughness,
        metalness,
        clearcoat,
        clearcoatRoughness
      }) => {
        const colorBlend = isSourceColor ? 0 : isVivid ? 0.92 : energy * 0.18
        const emissiveBlend = isSourceColor ? 0 : isVivid ? 0.84 : energy * 0.2
        const emissiveBoost = isSourceColor ? 0 : isVivid ? 1.15 : energy * 0.5

        if (color && material.color) {
          material.color.copy(color).lerp(accentColor, colorBlend)
        }
        if (emissive && material.emissive) {
          material.emissive.copy(emissive).lerp(accentColor, emissiveBlend)
          if (typeof emissiveIntensity === 'number') {
            if (isSourceColor) {
              const pulse = 0.78 + (Math.sin(elapsed * 1.8 + pose.energy * Math.PI) + 1) * 0.15
              material.emissiveIntensity = emissiveIntensity * pulse
            } else {
              material.emissiveIntensity = emissiveIntensity + emissiveBoost
            }
          }
        }
        if (!isSourceColor && typeof roughness === 'number') {
          material.roughness = MathUtils.lerp(roughness, Math.max(0.06, roughness * 0.7), energy)
        }
        if (!isSourceColor && typeof metalness === 'number') {
          material.metalness = MathUtils.lerp(metalness, Math.min(1, metalness + 0.14), energy)
        }
        if (!isSourceColor && typeof clearcoat === 'number') {
          material.clearcoat = MathUtils.lerp(clearcoat, Math.min(1, clearcoat + 0.2), energy)
        }
        if (!isSourceColor && typeof clearcoatRoughness === 'number') {
          material.clearcoatRoughness = MathUtils.lerp(clearcoatRoughness, Math.max(0.02, clearcoatRoughness * 0.7), energy)
        }
      }
    )
    lineMaterials.current.forEach((lineMaterial) => {
      lineMaterial.opacity = isSourceColor ? 0.12 + energy * 0.24 : isVivid ? 0.24 + energy * 0.56 : 0.18 + energy * 0.5
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

export function ModelScene({ scrollRef, pointerRef, intensity = 1, motionTuning, onReady }) {
  const { invalidate } = useThree()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isNarrowMobile = useMediaQuery('(max-width: 390px)')
  const readyReportedRef = useRef(false)
  const layoutTuning = isNarrowMobile
    ? {
        xFactor: 0.2,
        xOffset: -0.12,
        bottomXBias: -0.22,
        yOffset: 0.08,
        zOffset: 0.44,
        scaleFactor: 1.08864,
        perModel: {
          monolith: { x: -0.08, y: -0.28, z: 0.22, scale: 0.82 },
          ionDrive: { x: 0.62, y: 0.02, z: -0.1, scale: 1.06 },
          orb: { x: -0.42, y: 0.06, z: -2.2, scale: 2.18 }
        }
      }
    : isMobile
      ? {
          xFactor: 0.28,
          xOffset: -0.1,
          bottomXBias: -0.18,
          yOffset: 0.06,
          zOffset: 0.34,
          scaleFactor: 1.2096,
        perModel: {
          monolith: { x: -0.1, y: -0.32, z: 0.18, scale: 0.84 },
          ionDrive: { x: 0.72, y: 0.02, z: -0.08, scale: 1.04 },
          orb: { x: -0.52, y: 0.06, z: -2.25, scale: 2.32 }
        }
      }
    : {
          xFactor: 1,
          yOffset: 0,
          zOffset: 0,
        scaleFactor: 1,
        perModel: {
          ionDrive: { x: 0, y: -0.22, z: -0.06, scale: 1.16 },
          orb: { x: -2.5, y: 0.1, z: -2.35, scale: 2.91 }
        }
      }

  useEffect(() => {
    models.forEach((model) => {
      useGLTF.preload(model.url)
    })
    invalidate()
  }, [invalidate])

  useEffect(() => {
    if (readyReportedRef.current) {
      return
    }
    readyReportedRef.current = true
    onReady?.()
  }, [onReady])

  return (
    <group>
      {models.map((model) => (
        <InteractiveModel
          key={model.key}
          url={model.url}
          accent={model.accent}
          stages={model.stages}
          animationHint={model.animationHint}
          scaleBoost={model.scaleBoost}
          colorMode={model.colorMode}
          showEdges={intensity >= 0.8 ? model.showEdges : false}
          animationSpeed={model.animationSpeed}
          positionBoost={model.positionBoost}
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
