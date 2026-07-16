import { useEffect, useState } from 'react'
import type { ImageItem } from '../api/client'
import { createImage, deleteImage, listImages } from '../api/client'

export default function ImagesPanel() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = async () => setImages(await listImages())
  useEffect(() => {
    void refresh()
  }, [])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setBusy(true)
    try {
      await createImage({ title, url, caption })
      setTitle('')
      setUrl('')
      setCaption('')
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id?: number) => {
    if (!id) return
    if (!window.confirm('Delete this image?')) return
    await deleteImage(id)
    void refresh()
  }

  return (
    <div>
      <div className="panel-head">
        <h2>Gallery</h2>
      </div>

      <form className="inline-form" onSubmit={add}>
        <input placeholder="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} className="grow" />
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <button className="btn btn-primary" disabled={busy}>
          Add
        </button>
      </form>

      <div className="gallery">
        {images.map((img) => (
          <figure className="gcard" key={img.id}>
            <img src={img.url} alt={img.title} />
            <figcaption>
              <strong>{img.title || 'Untitled'}</strong>
              {img.caption && <span className="muted small">{img.caption}</span>}
            </figcaption>
            <button className="btn btn-sm btn-danger" onClick={() => remove(img.id)}>
              Delete
            </button>
          </figure>
        ))}
        {images.length === 0 && <p className="muted">No images yet.</p>}
      </div>
    </div>
  )
}
