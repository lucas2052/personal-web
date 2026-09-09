import { Link, useParams } from 'react-router-dom'
import { PROJECTS } from './projects'
import SiteNav from './SiteNav'
import './home.css'

export default function ProjectDetail() {
  const { slug } = useParams()
  const p = PROJECTS.find((x) => x.slug === slug)

  return (
    <div className="nf nf-detail">
      <SiteNav />

      {p ? (
        <article className="nf-detail-body">
          <p className="nf-micro">{p.tag} · {p.meta}</p>
          <h1 className="nf-display">{p.title}</h1>
          <p className="nf-detail-lede">{p.blurb}</p>
          {p.body.map((para, i) => (
            <p key={i} className="nf-detail-p">{para}</p>
          ))}
          <Link className="nf-detail-back" to="/">← Back to work</Link>
        </article>
      ) : (
        <div className="nf-detail-body">
          <h1 className="nf-display">Not found</h1>
          <Link className="nf-detail-back" to="/">← Back home</Link>
        </div>
      )}
    </div>
  )
}
