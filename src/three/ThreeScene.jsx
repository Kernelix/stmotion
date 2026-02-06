import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useRef } from 'react'
import { MathUtils } from 'three'
import { ProceduralMonolith } from '@/three/ProceduralMonolith'
import { ProceduralRibbon } from '@/three/ProceduralRibbon'
import { ProceduralOrbCluster } from '@/three/ProceduralOrbCluster'
import { ModelScene } from '@/three/ModelScene'
import { useModelAvailability } from '@/three/useModelAvailability'
import { threeConfig } from '@/content/config'
import { useIsLowEndDevice, usePrefersReducedMotion, usePointer } from '@/hooks'
import { sceneSections, rigStages } from '@/three/sceneStages'
import { clamp, getPose } from '@/three/poseUtils'
import { scrollStore } from '@/lib/scrollStore'

function useSceneTimeline(enabled, onChange) {
  const timeline = useRef({ index: 0, t: 0, progress: 0 })
  const centers = useRef([])

  useEffect(() => {
    if (!enabled) {
      return
    }

    let active = true

    const measure = () => {
      const scrollY = scrollStore.getState().y
      centers.current = sceneSections
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .map((section) => {
          const rect = section.getBoundingClientRect()
          return rect.top + scrollY + rect.height / 2
        })
    }

    const update = () => {
      if (!active) {
        return
      }
      const { y, viewport, progress } = scrollStore.getState()
      const midpoint = y + viewport / 2
      const points = centers.current
      if (!points.length) {
        return
      }
      let index = 0
      for (let i = 0; i < points.length - 1; i += 1) {
        if (midpoint >= points[i + 1]) {
          index = i + 1
        }
      }
      const start = points[index]
      const end = points[index + 1] ?? start + viewport
      const t = end === start ? 0 : (midpoint - start) / (end - start)
      timeline.current.index = index
      timeline.current.t = clamp(t)
      timeline.current.progress = progress
      if (onChange) {
        onChange()
      }
    }

    measure()
    update()
    const unsubscribe = scrollStore.subscribe(update)
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)

    return () => {
      active = false
      unsubscribe()
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
    }
  }, [enabled, onChange])

  return timeline
}

function InvalidateBridge({ invalidateRef }) {
  const { invalidate } = useThree()

  useEffect(() => {
    invalidateRef.current = invalidate
  }, [invalidate, invalidateRef])

  return null
}

function SceneRig({ children, scrollRef, pointerRef, intensity }) {
  const group = useRef(null)

  useFrame((state, delta) => {
    if (!group.current) {
      return
    }
    const { index, t } = scrollRef.current
    const pose = getPose(rigStages, index, t)
    const pointer = pointerRef.current
    const tiltX = pointer.y * 0.08 * intensity
    const tiltY = pointer.x * 0.12 * intensity
    const targetRotationX = pose.rotation[0] + tiltX
    const targetRotationY = pose.rotation[1] + tiltY
    const targetRotationZ = pose.rotation[2]
    let needsUpdate = false

    if (intensity === 0) {
      group.current.position.set(pose.position[0], pose.position[1], pose.position[2])
      group.current.rotation.set(targetRotationX, targetRotationY, targetRotationZ)
      group.current.scale.setScalar(pose.scale)
    } else {
      group.current.position.x = MathUtils.damp(group.current.position.x, pose.position[0], 3, delta)
      group.current.position.y = MathUtils.damp(group.current.position.y, pose.position[1], 3, delta)
      group.current.position.z = MathUtils.damp(group.current.position.z, pose.position[2], 3, delta)

      group.current.rotation.x = MathUtils.damp(group.current.rotation.x, targetRotationX, 3, delta)
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetRotationY, 3, delta)
      group.current.rotation.z = MathUtils.damp(group.current.rotation.z, targetRotationZ, 3, delta)

      const scale = MathUtils.damp(group.current.scale.x, pose.scale, 3, delta)
      group.current.scale.setScalar(scale)

      needsUpdate =
        Math.abs(group.current.position.x - pose.position[0]) > 0.0005 ||
        Math.abs(group.current.position.y - pose.position[1]) > 0.0005 ||
        Math.abs(group.current.position.z - pose.position[2]) > 0.0005 ||
        Math.abs(group.current.rotation.x - targetRotationX) > 0.0005 ||
        Math.abs(group.current.rotation.y - targetRotationY) > 0.0005 ||
        Math.abs(group.current.rotation.z - targetRotationZ) > 0.0005 ||
        Math.abs(group.current.scale.x - pose.scale) > 0.0005
    }

    if (intensity > 0 && needsUpdate) {
      state.invalidate()
    }
  })

  return <group ref={group}>{children}</group>
}

function SceneLights({ intensity, pointerRef }) {
  const key = useRef(null)
  const rim = useRef(null)

  useFrame((state, delta) => {
    if (intensity <= 0 || !key.current || !rim.current) {
      return
    }
    const pointer = pointerRef.current
    const targetX = 4 + pointer.x * 1.2
    const targetY = 5 + pointer.y * 1.2
    const targetZ = 3 + pointer.x * 0.6
    key.current.position.x = MathUtils.damp(key.current.position.x, targetX, 2, delta)
    key.current.position.y = MathUtils.damp(key.current.position.y, targetY, 2, delta)
    rim.current.position.z = MathUtils.damp(rim.current.position.z, targetZ, 2, delta)
    if (
      Math.abs(key.current.position.x - targetX) > 0.0005 ||
      Math.abs(key.current.position.y - targetY) > 0.0005 ||
      Math.abs(rim.current.position.z - targetZ) > 0.0005
    ) {
      state.invalidate()
    }
  })

  return (
    <>
      <ambientLight intensity={0.65 + intensity * 0.25} />
      <directionalLight
        ref={key}
        position={[4, 5, 4]}
        intensity={1.2 + intensity * 0.5}
        castShadow={intensity > 0.7}
      />
      <spotLight position={[-4, 3, 2]} intensity={0.9} angle={0.45} penumbra={0.9} />
      <pointLight ref={rim} position={[2.2, 1.4, 3]} intensity={0.75} color="#9cc0ff" distance={8} />
    </>
  )
}

export function ThreeScene({ className }) {
  const reducedMotion = usePrefersReducedMotion()
  const lowEnd = useIsLowEndDevice()
  const mode = threeConfig.forceMode ?? (reducedMotion ? 'static' : lowEnd ? 'lite' : 'full')
  const intensity = mode === 'full' ? 1 : mode === 'lite' ? 0.6 : 0
  const invalidateRef = useRef(null)
  const requestFrame = useCallback(() => {
    if (invalidateRef.current) {
      invalidateRef.current()
    }
  }, [])
  const scrollRef = useSceneTimeline(intensity > 0, requestFrame)
  const pointerRef = usePointer(intensity > 0, requestFrame)
  const allowModels = threeConfig.useModels || threeConfig.autoDetectModels
  const modelsAvailable = useModelAvailability(allowModels, threeConfig.modelPaths)
  const useModels = (threeConfig.useModels && modelsAvailable) || (threeConfig.autoDetectModels && modelsAvailable)

  return (
    <div className={className} aria-hidden>
      <Canvas
        shadows={mode === 'full'}
        frameloop="demand"
        dpr={mode === 'full' ? [1, 1.5] : [1, 1.25]}
        gl={{ antialias: mode !== 'lite', alpha: true, powerPreference: mode === 'full' ? 'high-performance' : 'low-power' }}
        camera={{ position: [0, 0.35, 6], fov: 32 }}
        events={null}
        style={{ pointerEvents: 'none', touchAction: 'pan-y', overflow: 'visible' }}
      >
        <InvalidateBridge invalidateRef={invalidateRef} />
        <color attach="background" args={['#f6f6f2']} />
        <fog attach="fog" args={['#f6f6f2', 6, 12]} />
        <SceneLights intensity={intensity} pointerRef={pointerRef} />
        {mode === 'full' ? (
          <Suspense fallback={null}>
            <Environment preset="studio" />
          </Suspense>
        ) : null}
        <SceneRig scrollRef={scrollRef} pointerRef={pointerRef} intensity={intensity}>
          {useModels ? (
            <Suspense
              fallback={
                <>
                  <ProceduralMonolith scrollRef={scrollRef} pointerRef={pointerRef} intensity={intensity} />
                  <ProceduralRibbon scrollRef={scrollRef} pointerRef={pointerRef} intensity={intensity} />
                  <ProceduralOrbCluster scrollRef={scrollRef} pointerRef={pointerRef} intensity={intensity} />
                </>
              }
            >
              <ModelScene scrollRef={scrollRef} pointerRef={pointerRef} intensity={intensity} />
            </Suspense>
          ) : (
            <>
              <ProceduralMonolith scrollRef={scrollRef} pointerRef={pointerRef} intensity={intensity} />
              <ProceduralRibbon scrollRef={scrollRef} pointerRef={pointerRef} intensity={intensity} />
              <ProceduralOrbCluster scrollRef={scrollRef} pointerRef={pointerRef} intensity={intensity} />
            </>
          )}
        </SceneRig>
        <ContactShadows position={[0, -1.2, 0]} opacity={0.28 + intensity * 0.15} scale={6} blur={2} far={4} />
      </Canvas>
    </div>
  )
}
