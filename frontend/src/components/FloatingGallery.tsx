import { Suspense, useCallback, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

// The owner's own photos drifting in 3D. Instead of a steady spin, the whole
// cloud re-forms between several spatial layouts (sphere, cloud, spiral, grid),
// flying each card out and back in with a staggered rhythm. When the mouse is
// over the scene the auto motion pauses and the view follows the pointer.
// Built from real photos — no third-party artwork.

const PHOTOS = Array.from({ length: 14 }, (_, i) => `p${i + 1}.png`)

// deterministic pseudo-random so the scatter is stable across renders
function rnd(k: number): number {
  const x = Math.sin(k * 127.1 + 11.3) * 43758.5453
  return x - Math.floor(x)
}

type Vec3 = [number, number, number]

function sphereLayout(n: number): Vec3[] {
  const r = 2.7
  const out: Vec3[] = []
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const th = Math.PI * (3 - Math.sqrt(5)) * i
    out.push([Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r])
  }
  return out
}

function cloudLayout(n: number): Vec3[] {
  const out: Vec3[] = []
  for (let i = 0; i < n; i++) {
    out.push([(rnd(i * 2 + 1) - 0.5) * 4.4, (rnd(i * 3 + 2) - 0.5) * 3.4, (rnd(i * 5 + 3) - 0.5) * 3.4])
  }
  return out
}

function spiralLayout(n: number): Vec3[] {
  const out: Vec3[] = []
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const ang = t * Math.PI * 4
    const rad = 1.1 + t * 1.5
    out.push([Math.cos(ang) * rad, (t - 0.5) * 3.4, Math.sin(ang) * rad])
  }
  return out
}

function gridLayout(n: number): Vec3[] {
  const out: Vec3[] = []
  const cols = 4
  const rows = Math.ceil(n / cols)
  for (let i = 0; i < n; i++) {
    const c = i % cols
    const r = Math.floor(i / cols)
    out.push([(c - (cols - 1) / 2) * 1.5, (r - (rows - 1) / 2) * 1.9, (rnd(i) - 0.5) * 1.0])
  }
  return out
}

const LAYOUTS = [sphereLayout, cloudLayout, spiralLayout, gridLayout]

function Card({ src, index, register }: { src: string; index: number; register: (i: number, m: THREE.Mesh) => void }) {
  const ref = useRef<THREE.Mesh>(null)
  const tex = useTexture(`/photos/${src}`)
  const img = tex.image as HTMLImageElement | undefined
  const aspect = img && img.width ? img.width / img.height : 0.78
  const scale = 0.65 + rnd(index) * 0.7
  const h = 1.7 * scale
  const w = h * aspect

  useEffect(() => {
    if (ref.current) register(index, ref.current)
  }, [index, register])

  return (
    <mesh ref={ref}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} side={THREE.DoubleSide} toneMapped={false} transparent />
    </mesh>
  )
}

function Gallery({ hover, pointer }: { hover: React.RefObject<boolean>; pointer: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null)
  const meshes = useRef<THREE.Mesh[]>([])
  const tl = useRef<gsap.core.Timeline | null>(null)

  const register = useCallback((i: number, m: THREE.Mesh) => {
    meshes.current[i] = m
  }, [])

  useEffect(() => {
    const list = meshes.current
    if (list.filter(Boolean).length !== PHOTOS.length) return
    const n = PHOTOS.length
    const L = LAYOUTS.map((fn) => fn(n))

    // start in the first layout
    list.forEach((m, i) => {
      m.position.set(...L[0][i])
      m.rotation.set((rnd(i) - 0.5) * 0.4, (rnd(i + 9) - 0.5) * 0.5, (rnd(i + 3) - 0.5) * 0.2)
    })

    const t = gsap.timeline({ repeat: -1 })
    for (let round = 0; round < L.length; round++) {
      const from = L[round]
      const to = L[(round + 1) % L.length]
      const base = t.duration()
      list.forEach((m, i) => {
        const f = from[i]
        const g = to[i]
        // fly out then in: a raised mid point gives the depth "swoop"
        const midX = (f[0] + g[0]) / 2 + (i % 2 ? 1 : -1) * (0.6 + rnd(i) * 0.8)
        const midY = (f[1] + g[1]) / 2 + (rnd(i + 4) - 0.5) * 0.8
        const midZ = Math.max(f[2], g[2]) + 1.6 + rnd(i + 7) * 1.2
        t.to(
          m.position,
          {
            keyframes: [
              { x: midX, y: midY, z: midZ, duration: 1.1, ease: 'power2.out' },
              { x: g[0], y: g[1], z: g[2], duration: 1.1, ease: 'power2.in' },
            ],
          },
          base + i * 0.05,
        )
        t.to(
          m.rotation,
          {
            x: (rnd(i + round * 3) - 0.5) * 0.7,
            y: (rnd(i + round * 5) - 0.5) * 0.8,
            z: (rnd(i + round) - 0.5) * 0.3,
            duration: 2.2,
            ease: 'power2.inOut',
          },
          base + i * 0.05,
        )
      })
      // hold the formation for a beat before the next re-form
      t.to({}, { duration: 1.1 }, base + 2.2)
    }
    tl.current = t
    return () => {
      t.kill()
      tl.current = null
    }
  }, [])

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const t = tl.current
    if (hover.current) {
      if (t && !t.paused()) t.pause()
      const tx = pointer.current.y * 0.5
      const ty = pointer.current.x * 0.6
      g.rotation.x += (tx - g.rotation.x) * 0.08
      g.rotation.y += (ty - g.rotation.y) * 0.08
    } else {
      if (t && t.paused()) t.resume()
      const e = state.clock.elapsedTime
      const ty = Math.sin(e * 0.15) * 0.35
      const tx = Math.cos(e * 0.1) * 0.12
      g.rotation.y += (ty - g.rotation.y) * 0.04
      g.rotation.x += (tx - g.rotation.x) * 0.04
    }
  })

  return (
    <group ref={group}>
      {PHOTOS.map((s, i) => (
        <Card key={s} src={s} index={i} register={register} />
      ))}
    </group>
  )
}

export default function FloatingGallery() {
  const hover = useRef(false)
  const pointer = useRef({ x: 0, y: 0 })

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
    pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  return (
    <div
      style={{ position: 'absolute', inset: 0 }}
      onPointerEnter={() => (hover.current = true)}
      onPointerLeave={() => (hover.current = false)}
      onPointerMove={onMove}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <Gallery hover={hover} pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  )
}
