import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Post, Profile } from './api/client'
import { getProfile, listPosts } from './api/client'

function App() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [blog, setBlog] = useState<Post[]>([])
  const [work, setWork] = useState<Post[]>([])

  useEffect(() => {
    void getProfile().then(setProfile)
    void listPosts('BLOG').then(setBlog)
    void listPosts('PORTFOLIO').then(setWork)
  }, [])

  return (
    <div className="site">
      <header className="site-header">
        <h1>{profile?.name || 'Luca Li'}</h1>
        {profile?.bio && <p className="tagline">{profile.bio}</p>}
        {profile && profile.urls.length > 0 && (
          <p className="profile-links">
            {profile.urls.map((u, i) => (
              <a key={i} href={u.url} target="_blank" rel="noopener noreferrer">
                {u.label || u.url}
              </a>
            ))}
          </p>
        )}
        <Link to="/admin" className="admin-entry">
          Admin →
        </Link>
      </header>

      <section className="site-section">
        <h2>Blog</h2>
        {blog.length === 0 && <p className="muted">No posts published yet.</p>}
        <ul className="post-list">
          {blog.map((p) => (
            <li key={p.id}>
              <strong>{p.title}</strong>
              <div className="post-preview" dangerouslySetInnerHTML={{ __html: p.content }} />
            </li>
          ))}
        </ul>
      </section>

      <section className="site-section">
        <h2>Portfolio</h2>
        {work.length === 0 && <p className="muted">Nothing here yet.</p>}
        <ul className="post-list">
          {work.map((p) => (
            <li key={p.id}>
              <strong>{p.title}</strong>
              <div className="post-preview" dangerouslySetInnerHTML={{ __html: p.content }} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default App
