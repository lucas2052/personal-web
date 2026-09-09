import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { PROJECTS } from './projects'

// a small shelf of project "books". Click a book to bring it to the front,
// click the front book to lift it (and reveal its details), click once more to
// open the project's detail page. Each book has a coloured spine so the ones
// tucked behind stay easy to tell apart.
export default function ProjectDeck() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const n = PROJECTS.length
  const front = PROJECTS[active]

  function handle(i: number) {
    if (i !== active) {
      setActive(i)
      setOpen(false)
    } else if (!open) {
      setOpen(true)
    } else {
      navigate(`/project/${PROJECTS[i].slug}`)
    }
  }

  return (
    <div className="nf-deck-wrap">
      <div className="nf-deck">
        {PROJECTS.map((p, i) => {
          const d = (i - active + n) % n // 0 = front of the shelf
          const isFront = d === 0
          const lifted = isFront && open
          const style: CSSProperties = {
            zIndex: n - d,
            transform: lifted
              ? 'translate3d(-4%, -30px, 150px) rotateY(-9deg) rotateX(3deg) scale(1.05)'
              : `translate3d(${-d * 26}px, ${-d * 12}px, ${-d * 72}px) rotateY(-20deg) scale(${(1 - d * 0.02).toFixed(3)})`,
          }
          return (
            <button
              type="button"
              key={p.slug}
              className={`nf-deck-card book-${i % 3}${isFront ? ' is-front' : ''}${lifted ? ' is-lifted' : ''}`}
              style={style}
              onClick={() => handle(i)}
              aria-label={p.title}
            >
              <span className={`nf-face nf-book-front${p.cover ? ' has-photo' : ''}`}>
                {p.cover ? (
                  <>
                    <span className="nf-book-head">
                      <span className="nf-deck-kicker">{p.tag}</span>
                      <span className="nf-book-title">{p.title}</span>
                    </span>
                    <span className="nf-book-photo" style={{ backgroundImage: `url(${p.cover})` }} />
                    <span className="nf-deck-foot">{p.meta}</span>
                  </>
                ) : (
                  <>
                    <span className="nf-deck-kicker">{p.tag}</span>
                    <span className="nf-book-title">{p.title}</span>
                    <span className="nf-deck-foot">{p.meta}</span>
                  </>
                )}
              </span>
              <span className="nf-face nf-book-spine">{p.title}</span>
              <span className="nf-face nf-book-pages" />
              <span className="nf-face nf-book-back" />
            </button>
          )
        })}
      </div>

      <div className={`nf-deck-meta${open ? ' is-open' : ''}`}>
        <p className="nf-micro">{front.tag} · {front.meta}</p>
        <h3>{front.title}</h3>
        <p className="nf-deck-blurb">{front.blurb}</p>
        <span className="nf-deck-cta">
          {open ? 'Click the cover again to open →' : 'Click a book to lift it'}
        </span>
      </div>
    </div>
  )
}
