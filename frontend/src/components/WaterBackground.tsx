import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Fullscreen quad: ignore the camera and map the plane straight to clip space.
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// Deep, clear water with shimmering sun-sparkle and a touch of iridescence.
const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
    return v;
  }

  void main() {
    float t = uTime * 0.12;
    float aspect = uResolution.x / uResolution.y;
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * aspect, uv.y);

    // rippling surface — waves stretched horizontally, domain-warped so it drifts
    vec2 wq = vec2(p.x * 2.3, p.y * 5.2) + vec2(t * 0.6, t * 0.25);
    float warp = fbm(wq * 0.6 + t * 0.3);
    float h = fbm(wq + warp);

    // deep clear water: darker at the top, slightly lighter toward the bottom
    vec3 deep = vec3(0.015, 0.10, 0.21);
    vec3 teal = vec3(0.05, 0.34, 0.47);
    vec3 base = mix(deep, teal, smoothstep(0.0, 1.25, uv.y + h * 0.7));

    // twinkling sun-sparkle — a sharp, thresholded high-frequency field
    float f = fbm(vec2(uv.x * aspect, uv.y) * vec2(10.0, 17.0) + vec2(t * 1.6, -t * 1.3) + h * 1.2);
    float glint = pow(smoothstep(0.60, 0.90, f), 5.0);

    // gather the brightest sparkle into a soft sun path, right of centre, fading down
    float band = smoothstep(0.6, 0.0, abs(uv.x - 0.62)) * smoothstep(1.15, 0.05, uv.y);
    glint *= 0.5 + 1.4 * band;

    // faint iridescence riding the ripples
    vec3 irid = 0.55 + 0.45 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + h * 1.4 + uv.x));

    vec3 col = base;
    col += glint * mix(vec3(1.0), irid, 0.35);   // sparkles, slightly rainbow
    col += band * 0.04 * teal;                    // gentle glow along the sun path

    col = clamp(col, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0);
  }
`

function WaterPlane() {
  const material = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  )

  useFrame(({ size }, delta) => {
    if (!material.current) return
    material.current.uniforms.uTime.value += delta
    material.current.uniforms.uResolution.value.set(size.width, size.height)
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default function WaterBackground() {
  return (
    <Canvas
      className="water-canvas"
      gl={{ antialias: false }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <WaterPlane />
    </Canvas>
  )
}
