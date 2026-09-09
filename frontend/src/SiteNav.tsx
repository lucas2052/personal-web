import { Link } from 'react-router-dom'

// Shared top nav used on sub-pages. Each item routes to its own page.
export default function SiteNav() {
  return (
    <header className="nf-nav">
      <nav className="nf-nav-right">
        <Link to="/">Homepage</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/contact">Contact me</Link>
      </nav>
    </header>
  )
}
