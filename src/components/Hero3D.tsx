import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/* ── shared helpers ── */
function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < breakpoint
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${breakpoint - 1}px)`)
    const cb = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }, [breakpoint])
  return mobile
}

/* ══════════════════════════════════════════════
   DESKTOP SCENE (unchanged)
   ══════════════════════════════════════════════ */
const holes = Array.from({ length: 9 }, (_, i) => -1.12 + i * 0.28)

function Frame({ position, rotation, inner }: { position: [number, number, number]; rotation: [number, number, number]; inner: string }) {
  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.7}>
      <group position={position} rotation={rotation}>
        <mesh><boxGeometry args={[2.7, 1.7, 0.1]} /><meshStandardMaterial color="#101010" roughness={0.45} metalness={0.35} /></mesh>
        <mesh position={[0, 0, 0.056]}><planeGeometry args={[2.3, 1.15]} /><meshStandardMaterial color={inner} roughness={0.6} /></mesh>
        {holes.map((x) => (
          <group key={x}>
            <mesh position={[x, 0.76, 0.056]}><planeGeometry args={[0.13, 0.1]} /><meshBasicMaterial color="#ffffff" /></mesh>
            <mesh position={[x, -0.76, 0.056]}><planeGeometry args={[0.13, 0.1]} /><meshBasicMaterial color="#ffffff" /></mesh>
          </group>
        ))}
      </group>
    </Float>
  )
}

function DesktopRig() {
  const g = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (!g.current) return
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, s.pointer.x * 0.35, 0.05)
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -s.pointer.y * 0.2, 0.05)
  })
  return (
    <group ref={g}>
      <Frame position={[0.3, 0.9, -0.8]} rotation={[0.05, -0.25, 0.08]} inner="#FF2028" />
      <Frame position={[-0.2, -0.1, 0]} rotation={[0, 0.05, -0.05]} inner="#EDEDED" />
      <Frame position={[0.5, -1.2, 0.8]} rotation={[-0.05, 0.25, 0.06]} inner="#2a2a2a" />
    </group>
  )
}

/* ══════════════════════════════════════════════
   MOBILE SCENE – Premium abstract 3D
   Morphing blob + orbiting shapes + particles
   Touch-drag interactive with momentum
   ══════════════════════════════════════════════ */

/* Orbiting geometric accent */
function OrbitingShape({ radius, speed, offset, size, color, shape }: {
  radius: number; speed: number; offset: number; size: number; color: string; shape: 'ico' | 'oct' | 'tetra' | 'torus'
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + offset
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
    ref.current.position.y = Math.sin(t * 1.5) * 0.3
    ref.current.rotation.x = t * 0.8
    ref.current.rotation.z = t * 0.5
  })
  return (
    <mesh ref={ref}>
      {shape === 'ico' && <icosahedronGeometry args={[size, 0]} />}
      {shape === 'oct' && <octahedronGeometry args={[size, 0]} />}
      {shape === 'tetra' && <tetrahedronGeometry args={[size, 0]} />}
      {shape === 'torus' && <torusGeometry args={[size, size * 0.35, 8, 16]} />}
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.15} />
    </mesh>
  )
}

/* Floating particles */
function Particles({ count = 40 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useRef<Float32Array>()
  const speeds = useRef<Float32Array>()

  if (!positions.current) {
    positions.current = new Float32Array(count * 3)
    speeds.current = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions.current[i * 3] = (Math.random() - 0.5) * 5
      positions.current[i * 3 + 1] = (Math.random() - 0.5) * 4
      positions.current[i * 3 + 2] = (Math.random() - 0.5) * 5
      speeds.current[i] = 0.2 + Math.random() * 0.6
    }
  }

  useFrame((state) => {
    if (!ref.current || !positions.current || !speeds.current) return
    const arr = ref.current.geometry.attributes.position.array as Float32Array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const s = speeds.current[i]
      arr[i * 3 + 1] = positions.current[i * 3 + 1] + Math.sin(t * s + i) * 0.3
      arr[i * 3] = positions.current[i * 3] + Math.sin(t * s * 0.5 + i * 2) * 0.15
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#FF2028" transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

/* Central morphing blob */
function MorphBlob() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.15
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
  })
  return (
    <mesh ref={ref} scale={1.15}>
      <icosahedronGeometry args={[1, 8]} />
      <MeshDistortMaterial
        color="#FF2028"
        roughness={0.15}
        metalness={0.9}
        distort={0.35}
        speed={2.5}
      />
    </mesh>
  )
}

/* Wobbling ring around the blob */
function WobbleRing() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    ref.current.rotation.z = state.clock.elapsedTime * 0.12
  })
  return (
    <mesh ref={ref} scale={1.6}>
      <torusGeometry args={[1, 0.04, 16, 64]} />
      <MeshWobbleMaterial
        color="#ffffff"
        metalness={0.7}
        roughness={0.1}
        factor={0.3}
        speed={1.5}
      />
    </mesh>
  )
}

/* Play-button triangle accent */
function PlayTriangle() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.x = 1.8
    ref.current.position.y = Math.sin(t * 0.8) * 0.15
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.15
    ref.current.rotation.y = t * 0.3
  })
  return (
    <mesh ref={ref} scale={0.35}>
      <coneGeometry args={[0.8, 1.2, 3]} />
      <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.2} />
    </mesh>
  )
}

/* Mobile interactive rig — drag to rotate everything */
function MobileScene() {
  const group = useRef<THREE.Group>(null)
  const drag = useRef({ active: false, px: 0, py: 0, vx: 0, vy: 0 })
  const rot = useRef({ x: -0.1, y: 0 })
  const { gl } = useThree()

  /* Touch handlers on canvas DOM element for reliable capture */
  useEffect(() => {
    const el = gl.domElement
    const onDown = (e: PointerEvent) => {
      drag.current = { active: true, px: e.clientX, py: e.clientY, vx: 0, vy: 0 }
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return
      const dx = e.clientX - drag.current.px
      const dy = e.clientY - drag.current.py
      drag.current.vx = dx
      drag.current.vy = dy
      rot.current.y += dx * 0.006
      rot.current.x = THREE.MathUtils.clamp(rot.current.x + dy * 0.004, -0.5, 0.5)
      drag.current.px = e.clientX
      drag.current.py = e.clientY
    }
    const onUp = () => { drag.current.active = false }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointerleave', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointerleave', onUp)
    }
  }, [gl])

  useFrame((state) => {
    if (!group.current) return
    const d = drag.current
    const t = state.clock.elapsedTime

    if (!d.active) {
      d.vx *= 0.94
      d.vy *= 0.94
      rot.current.y += d.vx * 0.003
      rot.current.x = THREE.MathUtils.clamp(rot.current.x + d.vy * 0.002, -0.5, 0.5)
      if (Math.abs(d.vx) < 0.05 && Math.abs(d.vy) < 0.05) {
        rot.current.y += Math.sin(t * 0.25) * 0.0015
      }
      group.current.position.y = Math.sin(t * 0.6) * 0.08
    }

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, rot.current.y, 0.07)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, rot.current.x, 0.07)
  })

  return (
    <group ref={group}>
      <MorphBlob />
      <WobbleRing />
      <PlayTriangle />
      <Particles count={35} />

      {/* orbiting accents */}
      <OrbitingShape radius={2.0} speed={0.5} offset={0} size={0.12} color="#FF2028" shape="ico" />
      <OrbitingShape radius={2.2} speed={0.35} offset={2} size={0.1} color="#ffffff" shape="oct" />
      <OrbitingShape radius={1.8} speed={0.6} offset={4} size={0.08} color="#FF2028" shape="tetra" />
      <OrbitingShape radius={2.4} speed={0.25} offset={1} size={0.09} color="#444" shape="torus" />
      <OrbitingShape radius={1.6} speed={0.45} offset={3} size={0.07} color="#fff" shape="ico" />

      {/* ground shadow */}
      <ContactShadows position={[0, -1.6, 0]} opacity={0.35} scale={6} blur={2.5} far={4} />
    </group>
  )
}

/* ══════════════════════════════════════════════
   EXPORTED COMPONENT
   ══════════════════════════════════════════════ */
export default function Hero3D() {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const mobile = useIsMobile()

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className={`hero3d ${mobile ? 'hero3d-mobile' : ''}`} aria-hidden="true">
      {mobile ? (
        /* Mobile: premium scene with environment reflections */
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.2, 5.5], fov: 42 }}
          frameloop={visible ? 'always' : 'never'}
          gl={{ alpha: true, antialias: true, powerPreference: 'default' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.8} />
          <pointLight position={[-3, 2, 4]} intensity={8} color="#FF2028" />
          <pointLight position={[3, -2, -2]} intensity={4} color="#ff6b6b" />
          <Environment preset="city" />
          <MobileScene />
        </Canvas>
      ) : (
        /* Desktop: existing film-frame scene */
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0, 6], fov: 40 }}
          frameloop={visible ? 'always' : 'never'}
          gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[4, 5, 5]} intensity={2.2} />
          <pointLight position={[-4, -2, 3]} intensity={12} color="#FF2028" />
          <DesktopRig />
        </Canvas>
      )}
    </div>
  )
}
