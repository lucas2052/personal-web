import { Link } from 'react-router-dom'
import AsciiFlower from './components/AsciiFlower'
import './home.css'

function App() {
  return (
    <div className="nf">
      {/* ---- hero: portrait ASCII flow ---- */}
      <section className="nf-hero-flow" id="top">
        <p className="nf-flow-welcome">Welcome, This is Luca&rsquo;s sketchbook.</p>

        <div className="nf-flow-stage" aria-label="Animated ASCII portrait">
          <AsciiFlower />
          <p className="nf-flow-caption">Portrait ASCII Flow<br />characters in motion</p>
        </div>

        <nav className="nf-flow-tabs" aria-label="Sections">
          <Link to="/blog">Blog</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/contact">Contact me</Link>
        </nav>

        <Link className="nf-flow-admin" to="/admin" aria-label="Admin">·</Link>

      </section>
    </div>
  )
}

export default App
