import { useEffect, useState } from 'react'

// A typewriter "decode" intro: each character scrambles through random glyphs
// then locks into place, left to right, then replays every few seconds.
const LINES = ['Hi,', '', "This is Luca's sketchbook.", 'Welcome', 'Have Fun']
const TARGET = LINES.join('\n')
const GLYPHS = '·:+*=<>/\\#-_?%'

export default function SketchbookText() {
  const [out, setOut] = useState(TARGET)

  useEffect(() => {
    let raf = 0
    let timer = 0

    const run = () => {
      let frame = 0
      const step = () => {
        frame++
        let s = ''
        for (let i = 0; i < TARGET.length; i++) {
          const ch = TARGET[i]
          if (ch === '\n' || ch === ' ') {
            s += ch
            continue
          }
          const lockAt = i * 1.4
          if (frame >= lockAt + 6) s += ch
          else if (frame >= lockAt) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          else s += ' '
        }
        setOut(s)
        if (frame < TARGET.length * 1.4 + 8) {
          raf = requestAnimationFrame(step)
        } else {
          setOut(TARGET)
          timer = window.setTimeout(run, 6000)
        }
      }
      step()
    }

    run()
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="nf-sketch">
      <pre className="nf-sketch-text">{out}</pre>
    </div>
  )
}
