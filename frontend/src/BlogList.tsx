import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Post } from './api/client'
import SiteNav from './SiteNav'
import { fmtDate, excerpt } from './format'
import './home.css'

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    api
      .get<Post[]>('/api/posts', { params: { type: 'BLOG' } })
      .then((r) => {
        setPosts(r.data)
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="nf nf-detail">
      <SiteNav />
      <div className="nf-detail-body">
        <p className="nf-micro">Writing</p>
        <h1 className="nf-display">Blog</h1>

        {status === 'loading' && <p className="nf-blog-empty">Loading…</p>}
        {status === 'error' && <p className="nf-blog-empty">Couldn’t load posts right now.</p>}
        {status === 'ok' && posts.length === 0 && <p className="nf-blog-empty">No posts yet — check back soon.</p>}

        <ul className="nf-blog-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link to={`/blog/${p.slug}`} className="nf-blog-item">
                <span className="nf-blog-date">{fmtDate(p.createdAt)}</span>
                <span className="nf-blog-title">{p.title}</span>
                <span className="nf-blog-excerpt">{excerpt(p.content)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
