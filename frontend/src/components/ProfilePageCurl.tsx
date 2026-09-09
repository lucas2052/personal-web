import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import ProfilePageOne from './profile/ProfilePageOne'
import ProfilePageTwo from './profile/ProfilePageTwo'
import ProfilePageThree from './profile/ProfilePageThree'

type CurlSheetProps = {
  frontUrl: string
  target: number
  direction: 1 | -1
}

const TURN_DURATION = 2400

const pages = [
  { src: '/profile/profile-page-final.png', alt: 'Who I am profile' },
  { src: '/profile/what-i-shipped-final.png', alt: 'What I shipped: product outcomes and selected mobile work' },
  { src: '/profile/why-i-am-here-final.png', alt: 'Why I am here: moving to New Zealand and widening my choices' },
]

function ProfilePage({ index }: { index: number }) {
  if (index === 0) return <ProfilePageOne />
  if (index === 1) return <ProfilePageTwo />
  return <ProfilePageThree />
}

const vertexShader = `
  uniform float uProgress;
  uniform float uDirection;
  varying vec2 vUv;
  varying float vBend;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    float radius = 0.66;
    float halfWidth = 1.6;
    float foldTilt = (uv.y - 0.5) * 0.1 * sin(uProgress * 3.14159265);
    float workingX = position.x * uDirection;
    float foldX = halfWidth - uProgress * (3.2 + 3.14159265 * radius) + foldTilt;
    float distanceIntoCurl = max(workingX - foldX, 0.0);
    float angle = min(distanceIntoCurl / radius, 3.14159265);
    float flatRemainder = max(distanceIntoCurl - 3.14159265 * radius, 0.0);
    vec3 curled = position;
    if (workingX > foldX) {
      curled.x = (foldX + sin(angle) * radius - flatRemainder) * uDirection;
      curled.z = (1.0 - cos(angle)) * radius;
      curled.y += sin(uv.y * 3.14159265) * sin(angle) * 0.07;
    }

    vBend = sin(angle);
    vNormal = normalize(normalMatrix * vec3(sin(angle), 0.0, cos(angle)));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(curled, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D uFront;
  uniform sampler2D uBack;
  varying vec2 vUv;
  varying float vBend;
  varying vec3 vNormal;

  void main() {
    vec2 backUv = vec2(1.0 - vUv.x, vUv.y);
    vec4 paper = gl_FrontFacing ? texture2D(uFront, vUv) : texture2D(uBack, backUv);
    float bend = abs(vBend);
    float curledLight = 0.77 + 0.23 * max(dot(normalize(vNormal), normalize(vec3(-0.45, 0.38, 1.0))), 0.0);
    float light = mix(1.0, curledLight, bend);
    float foldShade = 1.0 - bend * 0.18;
    gl_FragColor = vec4(paper.rgb * light * foldShade, paper.a);
  }
`

function FitPageCamera() {
  const { camera, size } = useThree()

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return
    camera.zoom = Math.min(size.width / 3.2, size.height / 2.08)
    camera.updateProjectionMatrix()
  }, [camera, size.height, size.width])

  return null
}

function makeBackTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1400
  canvas.height = 980
  const context = canvas.getContext('2d')!

  context.fillStyle = '#f3efe6'
  context.fillRect(0, 0, canvas.width, canvas.height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function CurlSheet({ frontUrl, target, direction }: CurlSheetProps) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const current = useRef(0)
  const front = useLoader(THREE.TextureLoader, frontUrl)
  const back = useMemo(() => makeBackTexture(), [])
  front.colorSpace = THREE.SRGBColorSpace
  front.anisotropy = 8
  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uDirection: { value: direction },
    uFront: { value: front },
    uBack: { value: back },
  }), [front, back, direction])

  useFrame((_, delta) => {
    current.current = THREE.MathUtils.damp(current.current, target, 2.8, delta)
    if (material.current) material.current.uniforms.uProgress.value = current.current
  })

  return (
    <mesh position={[0, 0, 0.14]}>
      <planeGeometry args={[3.2, 2.08, 104, 32]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function ProfilePageCurl() {
  const [progress, setProgress] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [revealingNext, setRevealingNext] = useState(false)
  const [turning, setTurning] = useState(false)
  const [turnDirection, setTurnDirection] = useState<1 | -1>(1)
  const startX = useRef(0)
  const startProgress = useRef(0)
  const finishTurnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasNextPage = pageIndex < pages.length - 1

  const updateTextColour = (event: React.PointerEvent<HTMLElement>) => {
    const pointerX = event.clientX
    const pointerY = event.clientY
    const characters = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('.profile-colour-char'),
    )

    characters.forEach(character => character.classList.remove('is-colour'))

    const hoveredIndex = characters.findIndex(character => {
      const bounds = character.getBoundingClientRect()
      return (
        pointerX >= bounds.left &&
        pointerX <= bounds.right &&
        pointerY >= bounds.top &&
        pointerY <= bounds.bottom
      )
    })

    if (hoveredIndex === -1) return

    characters[hoveredIndex - 1]?.classList.add('is-colour')
    characters[hoveredIndex]?.classList.add('is-colour')
    characters[hoveredIndex + 1]?.classList.add('is-colour')
  }

  const resetTextColour = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.querySelectorAll<HTMLElement>('.profile-colour-char.is-colour').forEach(element => element.classList.remove('is-colour'))
  }

  const startTurn = (direction: 1 | -1) => {
    setTurning(true)
    setTurnDirection(direction)
    setRevealingNext(true)
    setProgress(1)
    if (finishTurnTimer.current) clearTimeout(finishTurnTimer.current)
    finishTurnTimer.current = setTimeout(() => {
      setPageIndex(index => THREE.MathUtils.clamp(index + direction, 0, pages.length - 1))
      setProgress(0)
      setRevealingNext(false)
      setTurning(false)
      finishTurnTimer.current = null
    }, TURN_DURATION)
  }

  const beginDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasNextPage) return
    setTurnDirection(1)
    startX.current = event.clientX
    startProgress.current = progress
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const drag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    const width = Math.max(event.currentTarget.clientWidth * 0.72, 280)
    const next = THREE.MathUtils.clamp(startProgress.current + (startX.current - event.clientX) / width, 0, 1)
    if (next > 0.01) setRevealingNext(true)
    setProgress(next)
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setDragging(false)
    event.currentTarget.releasePointerCapture(event.pointerId)
    const next = progress > 0.42 ? 1 : 0
    if (next === 1) startTurn(1)
    else {
      setTurning(false)
      setRevealingNext(false)
      setProgress(0)
    }
  }

  const toggle = () => {
    if (!hasNextPage || turning) return
    startTurn(1)
  }

  const turnBack = () => {
    if (pageIndex === 0 || turning) return
    startTurn(-1)
  }

  const visiblePageIndex = revealingNext ? THREE.MathUtils.clamp(pageIndex + turnDirection, 0, pages.length - 1) : pageIndex

  return (
    <section
      className={`profile-curl ${turning || dragging ? 'is-turning' : 'is-idle'}`}
      aria-label="Interactive profile page"
      onPointerMove={updateTextColour}
      onPointerLeave={resetTextColour}
    >
      <div className="profile-curl-underlay">
        <ProfilePage index={visiblePageIndex} />
      </div>

      <div
        className={`profile-curl-canvas ${dragging ? 'is-dragging' : ''}`}
        onPointerDown={beginDrag}
        onPointerMove={drag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={toggle}
      >
        <Canvas orthographic camera={{ position: [0, 0, 5], zoom: 1 }} dpr={[1, 2]}>
          <FitPageCamera />
          <CurlSheet
            key={pageIndex}
            frontUrl={pages[pageIndex].src}
            target={progress}
            direction={turnDirection}
          />
        </Canvas>
      </div>

      {hasNextPage && (
        <button className="profile-curl-toggle" type="button" onClick={toggle} aria-label="Turn the profile page">
          Turn page →
        </button>
      )}
      {pageIndex > 0 && (
        <button className="profile-curl-toggle profile-curl-back" type="button" onClick={turnBack} aria-label="Turn back the profile page">
          ← Turn back
        </button>
      )}
    </section>
  )
}
