import { useState, useLayoutEffect, useRef } from 'react'

// The giant word, drawn as SVG text so it always fills its container's width
// exactly (the container = the content column, i.e. flush with the photo's
// edges). viewBox is the text's own bbox; width:100% + aspect-ratio makes it
// scale to fill precisely — never too big, never too small.
function FitText({ text, className }: { text: string; className?: string }) {
  const textRef = useRef<SVGTextElement>(null)
  const [box, setBox] = useState({ x: 0, y: -78, w: 1000, h: 100 })

  useLayoutEffect(() => {
    const measure = () => {
      const t = textRef.current
      if (!t) return
      const b = t.getBBox()
      if (b.width > 0) setBox({ x: b.x, y: b.y, w: b.width, h: b.height })
    }
    measure()
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure)
  }, [text])

  return (
    <svg
      className={className}
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      preserveAspectRatio="xMinYMid meet"
      style={{ width: '100%', aspectRatio: `${box.w} / ${box.h}`, display: 'block' }}
    >
      <text ref={textRef} x="0" y="0" fill="currentColor" style={{ fontSize: 100, fontWeight: 700, letterSpacing: '-0.02em' }}>
        {text}
      </text>
    </svg>
  )
}

type Panel = {
  num: string
  title: string
  desc?: string
  bullets: string[]
  big: string
  img: string
  video?: string
  slides?: string[]
  theme: 'light' | 'dark'
}

// Content transcribed from the low-fi layouts. Swap `img` for each project's
// own screenshot when ready (files live in /public/projects/).
const PANELS: Panel[] = [
  {
    num: '00-1',
    title: 'First Step Solution: Blockchain Data Sharing — Returning Data Control',
    desc: 'Blockchain-based data sovereignty platform built in collaboration with Māori communities. | JavaScript, C#, React, TypeScript, SQL, Tailwind.',
    bullets: [
      'Built a dual-interface React and Next.js application for workers and employers, using component-based architecture and custom hooks to keep the codebase consistent and maintainable.',
      'Designed and tested REST API endpoints in ASP.NET Core, managing relational data in Supabase with input validation and response handling across multiple routes.',
    ],
    big: 'DATA SHARING PLATFORM',
    img: '/projects/first-step.jpg',
    video: '/projects/worker-data-blockchain-demo.mp4',
    theme: 'light',
  },
  {
    num: '00-2',
    title: 'Side project: A full-stack music taste matching web app built with React and Node.js / Express.',
    bullets: [
      'Designed a standardised acoustic evaluation framework to quantify audio characteristics. Engineered a multi-dimensional scoring engine to enable data-driven user taste matching based on objective audio profiles.',
      'Managed complex transmissions (JSON payloads and multipart data) via Multer. Implemented secure authentication using bcrypt for robust password salting and hashing.',
      'Deployed the application on AWS, using S3 for frontend hosting and EC2 for backend services. Configured CI/CD pipelines to ensure automated, scalable delivery of the web tool.',
    ],
    big: 'Music Taste Match',
    img: '/projects/first-step.jpg',
    slides: [
      '/projects/music-match-1.png',
      '/projects/music-match-2.png',
      '/projects/music-match-3.png',
      '/projects/music-match-4.png',
    ],
    theme: 'dark',
  },
  {
    num: '00-3',
    title: 'Automated scheduling system built in collaboration with local company Theta.',
    bullets: [
      'Met with clients to translate their requirements into a structured scoring model built in C#.',
      'Wrote prompt instructions to shape how the LLM responded, keeping outputs concise and useful for end users.',
      'Integrated an open-source API as an internal tool, reducing output conflicts by 49% and cutting average processing time from 3 minutes by 50%.',
    ],
    big: 'LOCAL AGENT TOOL',
    img: '/projects/first-step.jpg',
    video: '/projects/certavue-scheduling-demo.mp4',
    theme: 'light',
  },
]

export default function ProjectPanels() {
  const [active, setActive] = useState(0)

  return (
    <div className="pp">
      {PANELS.map((p, i) => (
        <section
          key={p.num}
          className={`pp-panel pp-${p.theme} ${active === i ? 'is-active' : ''}`}
          onMouseEnter={() => setActive(i)}
          onClick={() => setActive(i)}
          aria-expanded={active === i}
        >
          {/* collapsed spine */}
          <div className="pp-spine">
            <span className="pp-spine-num">{p.num}</span>
            <span className="pp-spine-word">{p.big}</span>
          </div>

          {/* expanded content */}
          <div className="pp-content">
            <div className="pp-main">
              <div className="pp-left">
                <div className="pp-num">{p.num}</div>
                <h2 className="pp-title">{p.title}</h2>
                {p.desc && <p className="pp-desc">{p.desc}</p>}
                <ul className="pp-bullets">
                  {p.bullets.map((b, k) => (
                    <li key={k}>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="pp-shot">
                {p.slides ? (
                  <div className="pp-slider" aria-label={`${p.title} screenshot carousel`}>
                    <div className="pp-slider-track">
                      {[...p.slides, p.slides[0]].map((slide, slideIndex) => (
                        <img
                          src={slide}
                          alt={`${p.title} screenshot ${slideIndex % p.slides!.length + 1}`}
                          key={`${slide}-${slideIndex}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : p.video ? (
                  <video
                    src={p.video}
                    poster={p.img}
                    aria-label={`${p.title} screen recording`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img src={p.img} alt={`${p.title} screenshot`} />
                )}
              </div>
            </div>
            <FitText text={p.big} className="pp-big" />
          </div>
        </section>
      ))}
    </div>
  )
}
