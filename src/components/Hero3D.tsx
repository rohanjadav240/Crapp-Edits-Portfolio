import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
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
   DESKTOP SCENE
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

  // Do not render 3D canvas on mobile/phone screens
  if (mobile) return null

  return (
    <div ref={wrap} className="hero3d" aria-hidden="true">
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
    </div>
  )
}
