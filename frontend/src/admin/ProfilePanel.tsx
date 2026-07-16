import { useEffect, useState } from 'react'
import type { Profile } from '../api/client'
import { getProfile, updateProfile } from '../api/client'

const EMPTY: Profile = { name: '', bio: '', email: '', location: '', avatarUrl: '', urls: [] }

export default function ProfilePanel() {
  const [profile, setProfile] = useState<Profile>(EMPTY)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void getProfile().then((p) => setProfile({ ...EMPTY, ...p, urls: p.urls ?? [] }))
  }, [])

  const set = (field: keyof Profile, value: string) =>
    setProfile((p) => ({ ...p, [field]: value }))

  // --- custom URL list helpers ---
  const addUrl = () => setProfile((p) => ({ ...p, urls: [...p.urls, { label: '', url: '' }] }))
  const removeUrl = (i: number) =>
    setProfile((p) => ({ ...p, urls: p.urls.filter((_, idx) => idx !== i) }))
  const editUrl = (i: number, field: 'label' | 'url', value: string) =>
    setProfile((p) => ({
      ...p,
      urls: p.urls.map((u, idx) => (idx === i ? { ...u, [field]: value } : u)),
    }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setSaved(false)
    try {
      // Drop blank rows so we don't save empty links.
      const cleaned: Profile = {
        ...profile,
        urls: profile.urls.filter((u) => u.label.trim() || u.url.trim()),
      }
      const updated = await updateProfile(cleaned)
      setProfile({ ...EMPTY, ...updated, urls: updated.urls ?? [] })
      setSaved(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="panel-head">
        <h2>Profile</h2>
      </div>

      <form className="stack-form" onSubmit={save}>
        <label>
          Name
          <input value={profile.name} onChange={(e) => set('name', e.target.value)} />
        </label>
        <label>
          Bio
          <textarea rows={3} value={profile.bio} onChange={(e) => set('bio', e.target.value)} />
        </label>
        <label>
          Email
          <input value={profile.email} onChange={(e) => set('email', e.target.value)} />
        </label>
        <label>
          Location
          <input value={profile.location} onChange={(e) => set('location', e.target.value)} />
        </label>
        <label>
          Avatar URL
          <input value={profile.avatarUrl ?? ''} onChange={(e) => set('avatarUrl', e.target.value)} />
        </label>

        <div className="url-list">
          <div className="url-list-head">
            <span>Custom URLs</span>
            <button type="button" className="btn btn-sm" onClick={addUrl}>
              + Add URL
            </button>
          </div>
          {profile.urls.length === 0 && (
            <p className="muted small">None yet — add your personal site, portfolio, etc.</p>
          )}
          {profile.urls.map((u, i) => (
            <div className="url-row" key={i}>
              <input
                placeholder="Label (e.g. Portfolio)"
                value={u.label}
                onChange={(e) => editUrl(i, 'label', e.target.value)}
              />
              <input
                className="grow"
                placeholder="https://…"
                value={u.url}
                onChange={(e) => editUrl(i, 'url', e.target.value)}
              />
              <button type="button" className="btn btn-sm btn-danger" onClick={() => removeUrl(i)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="row-actions">
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save profile'}
          </button>
          {saved && <span className="muted small">Saved ✓</span>}
        </div>
      </form>
    </div>
  )
}
