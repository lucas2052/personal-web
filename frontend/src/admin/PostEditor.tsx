import { useState } from 'react'
import type { Post, PostStatus, PostType } from '../api/client'
import { createPost, updatePost } from '../api/client'
import RichTextEditor from '../components/RichTextEditor'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

interface Props {
  initial: Post | null // null = new post
  defaultType: PostType
  onDone: () => void // saved or cancelled — parent should refresh + close
}

export default function PostEditor({ initial, defaultType, onDone }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [type, setType] = useState<PostType>(initial?.type ?? defaultType)
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const onTitle = (v: string) => {
    setTitle(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  const save = async (status: PostStatus) => {
    if (!title.trim()) return setError('Give the post a title first.')
    if (!slug.trim()) return setError('A slug is required (used in the URL).')
    setError('')
    setBusy(true)
    const payload: Post = { title, slug, type, coverImage, content, status }
    try {
      if (initial?.id) await updatePost(initial.id, payload)
      else await createPost(payload)
      onDone()
    } catch {
      setError('Save failed. Is the backend running and are you signed in?')
      setBusy(false)
    }
  }

  return (
    <div className="editor-page">
      <div className="editor-head">
        <button type="button" className="btn btn-ghost" onClick={onDone}>
          ← Back
        </button>
        <h2>{initial ? 'Edit post' : 'New post'}</h2>
        <div className="editor-head-actions">
          <button type="button" className="btn" disabled={busy} onClick={() => save('DRAFT')}>
            Save draft
          </button>
          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => save('PUBLISHED')}>
            Publish
          </button>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="editor-meta">
        <label className="grow">
          Title
          <input value={title} onChange={(e) => onTitle(e.target.value)} placeholder="Post title" />
        </label>
        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value as PostType)}>
            <option value="BLOG">Blog</option>
            <option value="PORTFOLIO">Portfolio</option>
          </select>
        </label>
      </div>

      <div className="editor-meta">
        <label className="grow">
          Slug (URL)
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(e.target.value)
            }}
            placeholder="my-post"
          />
        </label>
        <label className="grow">
          Cover image URL (optional)
          <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://…" />
        </label>
      </div>

      <label className="editor-content-label">Content</label>
      <RichTextEditor value={content} onChange={setContent} />
    </div>
  )
}
