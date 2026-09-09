import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, type Post } from './api/client'
import SiteNav from './SiteNav'
import { fmtDate } from './format'
import './home.css'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'missing'>('loading')

  useEffect(() => {
    setStatus('loading')
    api
      .get<Post>(`/api/posts/${slug}`)
      .then((r) => {
        setPost(r.data)
        setStatus('ok')
      })
      .catch(() => setStatus('missing'))
  }, [slug])

  return (
    <div className="nf nf-detail">
      <SiteNav />

      {status === 'loading' && (
        <div className="nf-detail-body">
          <p className="nf-blog-empty">Loading…</p>
        </div>
      )}

      {status === 'missing' && (
        <div className="nf-detail-body">
          <h1 className="nf-display">Not found</h1>
          <Link className="nf-detail-back" to="/blog">← Back to blog</Link>
        </div>
      )}

      {post && (
        <article className="nf-detail-body">
          <p className="nf-micro">{fmtDate(post.createdAt)}</p>
          <h1 className="nf-display">{post.title}</h1>
          {post.coverImage && <img className="nf-blog-cover" src={post.coverImage} alt="" />}
          <div className="nf-blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          <Link className="nf-detail-back" to="/blog">← Back to blog</Link>
        </article>
      )}
    </div>
  )
}
