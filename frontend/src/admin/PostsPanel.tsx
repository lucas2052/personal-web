import { useCallback, useEffect, useState } from 'react'
import type { Post, PostType } from '../api/client'
import { deletePost, listPosts } from '../api/client'
import PostEditor from './PostEditor'

export default function PostsPanel() {
  const [type, setType] = useState<PostType>('BLOG')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Post | null | 'new'>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setPosts(await listPosts(type, true)) // includeDrafts — we're the owner
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const remove = async (post: Post) => {
    if (!post.id) return
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return
    await deletePost(post.id)
    void refresh()
  }

  if (editing !== null) {
    return (
      <PostEditor
        initial={editing === 'new' ? null : editing}
        defaultType={type}
        onDone={() => {
          setEditing(null)
          void refresh()
        }}
      />
    )
  }

  return (
    <div>
      <div className="panel-head">
        <div className="seg">
          <button className={type === 'BLOG' ? 'active' : ''} onClick={() => setType('BLOG')}>
            Blog
          </button>
          <button className={type === 'PORTFOLIO' ? 'active' : ''} onClick={() => setType('PORTFOLIO')}>
            Portfolio
          </button>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing('new')}>
          + New post
        </button>
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="muted">No {type.toLowerCase()} posts yet. Create one.</p>
      ) : (
        <table className="tbl">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.title}</strong>
                  <div className="muted small">/{p.slug}</div>
                </td>
                <td>
                  <span className={`badge ${p.status === 'PUBLISHED' ? 'badge-green' : 'badge-gray'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="muted small">
                  {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}
                </td>
                <td className="row-actions">
                  <button className="btn btn-sm" onClick={() => setEditing(p)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(p)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
