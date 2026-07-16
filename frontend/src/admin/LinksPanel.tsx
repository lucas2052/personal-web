import { useEffect, useState } from 'react'
import type { Link } from '../api/client'
import { createLink, deleteLink, listLinks, updateLink } from '../api/client'

export default function LinksPanel() {
  const [links, setLinks] = useState<Link[]>([])
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')

  const refresh = async () => setLinks(await listLinks())
  useEffect(() => {
    void refresh()
  }, [])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim() || !url.trim()) return
    await createLink({ label, url, sortOrder: links.length + 1 })
    setLabel('')
    setUrl('')
    void refresh()
  }

  const save = async (link: Link) => {
    if (!link.id) return
    await updateLink(link.id, link)
    void refresh()
  }

  const remove = async (id?: number) => {
    if (!id) return
    await deleteLink(id)
    void refresh()
  }

  const edit = (id: number | undefined, field: keyof Link, value: string) =>
    setLinks((ls) => ls.map((l) => (l.id === id ? { ...l, [field]: value } : l)))

  return (
    <div>
      <div className="panel-head">
        <h2>Links</h2>
      </div>

      <form className="inline-form" onSubmit={add}>
        <input placeholder="Label (e.g. GitHub)" value={label} onChange={(e) => setLabel(e.target.value)} />
        <input placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} className="grow" />
        <button className="btn btn-primary">Add link</button>
      </form>

      <table className="tbl">
        <tbody>
          {links.map((l) => (
            <tr key={l.id}>
              <td>
                <input value={l.label} onChange={(e) => edit(l.id, 'label', e.target.value)} />
              </td>
              <td className="grow-cell">
                <input value={l.url} onChange={(e) => edit(l.id, 'url', e.target.value)} />
              </td>
              <td className="row-actions">
                <button className="btn btn-sm" onClick={() => save(l)}>
                  Save
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => remove(l.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {links.length === 0 && (
            <tr>
              <td className="muted">No links yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
