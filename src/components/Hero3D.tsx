import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/* ── Realistic synthesized clapper sound using Web Audio API ── */
function playClapperSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    // Crisp high-frequency wooden/metal impact
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(480, now)
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.065)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.075)

    // Secondary subtle slap echo
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(240, now + 0.008)
    osc2.frequency.exponentialRampToValueAtTime(35, now + 0.075)
    gain2.gain.setValueAtTime(0.25, now + 0.008)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.075)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.008)
    osc2.stop(now + 0.085)
  } catch {
    // Silently continue if audio context is blocked
  }
}

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
   DESKTOP SCENE (preserved)
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
   MOBILE SCENE – Interactive 3D "CRAPP EDITS"
   High-definition branded clapperboard rig
   ══════════════════════════════════════════════ */

/* Procedural diagonal red/black hazard stripes for the clapper arm */
function useStripeTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#111111'
      ctx.fillRect(0, 0, 512, 128)
      ctx.fillStyle = '#FF2028'
      for (let x = -128; x < 640; x += 72) {
        ctx.beginPath()
        ctx.moveTo(x, 128)
        ctx.lineTo(x + 44, 0)
        ctx.lineTo(x + 78, 0)
        ctx.lineTo(x + 34, 128)
        ctx.closePath()
        ctx.fill()
      }
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

/* High-Contrast "CRAPP EDITS" Branded Slate Face Texture */
function useLogoPlateTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 560
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Deep brushed dark slate
      const grad = ctx.createLinearGradient(0, 0, 0, 560)
      grad.addColorStop(0, '#1d1d1d')
      grad.addColorStop(0.5, '#121212')
      grad.addColorStop(1, '#090909')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 1024, 560)

      // Subtle horizontal precision film lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)'
      ctx.lineWidth = 1.5
      for (let y = 0; y < 560; y += 18) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(1024, y)
        ctx.stroke()
      }

      // Red radial spotlight glow behind EDITS
      const glow = ctx.createRadialGradient(720, 310, 10, 720, 310, 240)
      glow.addColorStop(0, 'rgba(255, 32, 40, 0.55)')
      glow.addColorStop(1, 'rgba(255, 32, 40, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(350, 100, 674, 460)

      // Inner double border frame
      ctx.strokeStyle = '#FF2028'
      ctx.lineWidth = 6
      ctx.strokeRect(18, 18, 988, 524)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 2
      ctx.strokeRect(28, 28, 968, 504)

      // "CRAPP" text - Big, bold, ultra-crisp white Anton/Impact typography
      ctx.save()
      ctx.font = '900 170px Anton, Impact, "Arial Black", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Depth shadow
      ctx.fillStyle = 'rgba(0,0,0,0.9)'
      ctx.fillText('CRAPP', 484, 216)

      // Solid gleaming white
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText('CRAPP', 480, 210)

      // Fine outline
      ctx.strokeStyle = 'rgba(255, 32, 40, 0.8)'
      ctx.lineWidth = 3
      ctx.strokeText('CRAPP', 480, 210)
      ctx.restore()

      // "EDITS" text - Stylized slanted vibrant red marker style
      ctx.save()
      ctx.translate(685, 310)
      ctx.rotate(-0.1) // 6 degree slant
      ctx.font = '900 120px "Permanent Marker", Impact, cursive, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Dark red shadow
      ctx.fillStyle = '#660000'
      ctx.fillText('EDITS', 6, 6)

      // Bright fiery red
      ctx.fillStyle = '#FF2028'
      ctx.fillText('EDITS', 0, 0)
      ctx.restore()

      // Bottom tagline
      ctx.save()
      ctx.font = '700 24px "Space Grotesk", sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.textAlign = 'center'
      ctx.fillText('• CREATIVE VIDEO AGENCY •', 512, 480)
      ctx.restore()
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

/* Production slate bottom badge texture */
function useSlateDetailsTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 96
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#141414'
      ctx.fillRect(0, 0, 512, 96)

      ctx.strokeStyle = '#2a2a2a'
      ctx.lineWidth = 2
      ctx.strokeRect(4, 4, 504, 88)
      ctx.beginPath()
      ctx.moveTo(170, 4)
      ctx.lineTo(170, 92)
      ctx.moveTo(340, 4)
      ctx.lineTo(340, 92)
      ctx.stroke()

      ctx.fillStyle = '#888888'
      ctx.font = 'bold 16px sans-serif'
      ctx.fillText('SCENE', 20, 32)
      ctx.fillText('TAKE', 190, 32)
      ctx.fillText('FPS', 360, 32)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 28px sans-serif'
      ctx.fillText('01', 20, 72)

      ctx.fillStyle = '#FF2028'
      ctx.font = 'bold 28px sans-serif'
      ctx.fillText('24', 190, 72)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 28px sans-serif'
      ctx.fillText('60 4K', 360, 72)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

/* 3D Film Reel model */
function FilmReel({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.9
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.25
  })
  return (
    <group ref={ref} position={position} scale={0.44}>
      {/* Outer Metallic Rims */}
      <mesh position={[0, 0, 0.12]}>
        <torusGeometry args={[1, 0.08, 16, 48]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.92} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0, -0.12]}>
        <torusGeometry args={[1, 0.08, 16, 48]} />
        <meshStandardMaterial color="#f0f0f0" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* Center Hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.26, 32]} />
        <meshStandardMaterial color="#FF2028" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Film Spool Core */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.2, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>

      {/* Spokes (4 crossbars) */}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((ang, i) => (
        <mesh key={i} rotation={[0, 0, ang]}>
          <boxGeometry args={[1.9, 0.1, 0.04]} />
          <meshStandardMaterial color="#e5e5e5" metalness={0.85} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

/* 3D Glowing Play Button */
function PlayIcon({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = t * 1.4
    ref.current.position.y = position[1] + Math.sin(t * 2) * 0.08
  })
  return (
    <mesh ref={ref} position={position} rotation={[0, 0, -Math.PI / 2]} scale={0.26}>
      <coneGeometry args={[0.8, 1.2, 3]} />
      <meshStandardMaterial color="#FF2028" emissive="#FF2028" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

/* Bursting Sparks on Clap */
function ClapSparks({ triggerTime }: { triggerTime: number }) {
  const count = 42
  const ptsRef = useRef<THREE.Points>(null)
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = -1.2
      pos[i * 3 + 1] = 0.95
      pos[i * 3 + 2] = 0.15

      const angle = (Math.random() * Math.PI) - Math.PI / 4
      const speed = 1.4 + Math.random() * 2.8
      vel[i * 3] = Math.cos(angle) * speed
      vel[i * 3 + 1] = (Math.random() * 0.9 + 0.4) * speed
      vel[i * 3 + 2] = (Math.random() - 0.5) * speed
    }
    return { pos, vel }
  }, [])

  useFrame((state) => {
    if (!ptsRef.current) return
    const dt = state.clock.elapsedTime - triggerTime
    const arr = ptsRef.current.geometry.attributes.position.array as Float32Array
    if (dt > 0 && dt < 1.2) {
      for (let i = 0; i < count; i++) {
        arr[i * 3] = -1.2 + data.vel[i * 3] * dt
        arr[i * 3 + 1] = 0.95 + data.vel[i * 3 + 1] * dt - 5.2 * dt * dt
        arr[i * 3 + 2] = 0.15 + data.vel[i * 3 + 2] * dt
      }
      ptsRef.current.visible = true
      ptsRef.current.geometry.attributes.position.needsUpdate = true
    } else {
      ptsRef.current.visible = false
    }
  })

  return (
    <points ref={ptsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.065} color="#FF2028" transparent opacity={0.95} />
    </points>
  )
}

/* ══════════════════════════════════════════════
   Interactive Clapperboard Assembly
   ══════════════════════════════════════════════ */
function Clapperboard({ onClap }: { onClap: () => void }) {
  const stripeTex = useStripeTexture()
  const logoPlateTex = useLogoPlateTexture()
  const slateDetailsTex = useSlateDetailsTexture()

  const armRef = useRef<THREE.Group>(null)
  const clapAnim = useRef({ active: false, start: 0 })

  const triggerClap = useCallback(() => {
    clapAnim.current = { active: true, start: performance.now() }
    playClapperSound()
    onClap()
  }, [onClap])

  useFrame(() => {
    if (!armRef.current) return
    if (clapAnim.current.active) {
      const elapsed = (performance.now() - clapAnim.current.start) / 1000
      if (elapsed < 0.12) {
        // Swing up quickly to 38 deg
        armRef.current.rotation.z = THREE.MathUtils.lerp(0, 0.65, elapsed / 0.12)
      } else if (elapsed < 0.24) {
        // Snap down with punch
        armRef.current.rotation.z = THREE.MathUtils.lerp(0.65, 0, (elapsed - 0.12) / 0.12)
      } else if (elapsed < 0.45) {
        // Elastic rebound bounce
        const bounce = Math.sin((elapsed - 0.24) * 30) * Math.exp(-(elapsed - 0.24) * 12) * 0.12
        armRef.current.rotation.z = Math.max(0, bounce)
      } else {
        armRef.current.rotation.z = 0
        clapAnim.current.active = false
      }
    }
  })

  return (
    <group onClick={(e) => { e.stopPropagation(); triggerClap() }}>
      {/* ── Main Slate Body ── */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[2.5, 1.7, 0.12]} />
        <meshStandardMaterial color="#121212" roughness={0.35} metalness={0.4} />
      </mesh>

      {/* Outer border frame */}
      <mesh position={[0, -0.05, 0.062]}>
        <planeGeometry args={[2.44, 1.64]} />
        <meshStandardMaterial color="#FF2028" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* ── Official High-Contrast CRAPP EDITS Logo Centerpiece (Front) ── */}
      <mesh position={[0, 0.18, 0.07]}>
        <planeGeometry args={[2.2, 1.05]} />
        <meshBasicMaterial map={logoPlateTex} />
      </mesh>

      {/* ── Back Face Logo Plate (for 360 rotation) ── */}
      <mesh position={[0, -0.05, -0.062]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.44, 1.64]} />
        <meshStandardMaterial color="#FF2028" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.05, -0.065]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.36, 1.56]} />
        <meshBasicMaterial map={logoPlateTex} />
      </mesh>

      {/* ── Bottom Slate Production Details ("SCENE / TAKE / FPS") ── */}
      <mesh position={[0, -0.56, 0.07]}>
        <planeGeometry args={[2.2, 0.38]} />
        <meshBasicMaterial map={slateDetailsTex} />
      </mesh>

      {/* ── Fixed Base Stick (top of body) ── */}
      <mesh position={[0, 0.86, 0.02]}>
        <boxGeometry args={[2.5, 0.22, 0.14]} />
        <meshStandardMaterial map={stripeTex} roughness={0.3} metalness={0.3} />
      </mesh>

      {/* ── Hinged Clapper Arm (animated) ── */}
      <group position={[-1.25, 1.1, 0.02]} ref={armRef}>
        <mesh position={[1.25, 0, 0]}>
          <boxGeometry args={[2.5, 0.22, 0.14]} />
          <meshStandardMaterial map={stripeTex} roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Hinge metallic pin */}
        <mesh position={[0.08, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.16, 24]} />
          <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* Chrome Corner Rivets on Slate */}
      {[
        [-1.14, -0.78],
        [1.14, -0.78],
        [-1.14, 0.68],
        [1.14, 0.68],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 16]} />
          <meshStandardMaterial color="#e5e5e5" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
    </group>
  )
}

/* ══════════════════════════════════════════════
   Mobile Scene Rig with Touch Drag & Physics
   ══════════════════════════════════════════════ */
function MobileInteractiveScene() {
  const group = useRef<THREE.Group>(null)
  const drag = useRef({ active: false, px: 0, py: 0, vx: 0, vy: 0 })
  const rot = useRef({ x: -0.05, y: 0.15 })
  const [triggerSpark, setTriggerSpark] = useState(0)
  const { gl } = useThree()

  const onClap = useCallback(() => {
    setTriggerSpark(performance.now() / 1000)
    rot.current.x += 0.08
    rot.current.y += (Math.random() - 0.5) * 0.1
  }, [])

  /* Touch / Pointer drag handlers on canvas DOM element */
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
      rot.current.y += dx * 0.007
      rot.current.x = THREE.MathUtils.clamp(rot.current.x + dy * 0.005, -0.6, 0.6)
      drag.current.px = e.clientX
      drag.current.py = e.clientY
    }
    const onUp = () => {
      drag.current.active = false
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [gl])

  useFrame((state) => {
    if (!group.current) return
    const d = drag.current
    const t = state.clock.elapsedTime

    if (!d.active) {
      d.vx *= 0.92
      d.vy *= 0.92
      rot.current.y += d.vx * 0.004
      rot.current.x = THREE.MathUtils.clamp(rot.current.x + d.vy * 0.003, -0.45, 0.45)

      // Gently restore to front-facing angle (with subtle breathing sway)
      const idleSway = Math.sin(t * 0.9) * 0.12
      rot.current.y = THREE.MathUtils.lerp(rot.current.y, idleSway, 0.025)
      rot.current.x = THREE.MathUtils.lerp(rot.current.x, -0.04 + Math.cos(t * 0.7) * 0.04, 0.025)
      group.current.position.y = Math.sin(t * 1.1) * 0.07
    }

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, rot.current.y, 0.1)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, rot.current.x, 0.1)
  })

  return (
    <group ref={group} scale={0.92}>
      {/* Main Director's Clapperboard with Logo */}
      <Clapperboard onClap={onClap} />

      {/* Orbiting 3D Film Reel */}
      <FilmReel position={[1.85, 0.6, -0.4]} />

      {/* Floating 3D Play Button */}
      <PlayIcon position={[-1.75, -0.6, 0.5]} />

      {/* Orbiting film strip ribbon loop */}
      <mesh position={[0, -0.1, -0.6]} rotation={[0.3, 0.5, 0]}>
        <torusGeometry args={[2.1, 0.05, 16, 64]} />
        <meshStandardMaterial color="#FF2028" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Burst Sparks */}
      <ClapSparks triggerTime={triggerSpark} />

      {/* Ground Contact Shadow */}
      <ContactShadows position={[0, -1.5, 0]} opacity={0.38} scale={5.5} blur={2.2} far={3.5} />
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
    <div ref={wrap} className={`hero3d ${mobile ? 'hero3d-mobile' : ''}`} aria-hidden="false">
      {mobile ? (
        /* Mobile: Interactive 3D "CRAPP EDITS" Director's Clapperboard */
        <>
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0.05, 5.2], fov: 44 }}
            frameloop={visible ? 'always' : 'never'}
            gl={{ alpha: true, antialias: true, powerPreference: 'default' }}
          >
            <ambientLight intensity={1.2} />
            <directionalLight position={[4, 6, 5]} intensity={2.4} />
            <directionalLight position={[-4, -2, -3]} intensity={1.0} color="#ff6b6b" />
            <pointLight position={[-2, 2, 3]} intensity={12} color="#FF2028" />
            <pointLight position={[2, -1, 3]} intensity={6} color="#ffffff" />
            <MobileInteractiveScene />
          </Canvas>
        </>
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
