import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom'
import { checkSession, logout } from '../auth'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [sessionState, setSessionState] = useState<'checking' | 'authenticated' | 'anonymous'>('checking')

  useEffect(() => {
    void checkSession().then((ok) => setSessionState(ok ? 'authenticated' : 'anonymous'))
  }, [])

  if (sessionState === 'checking') return <div className="login-wrap">Checking session…</div>
  if (sessionState === 'anonymous') return <Navigate to="/login" replace />

  const signOut = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="admin">
      <aside className="admin-nav">
        <div className="admin-brand">Luca · Admin</div>
        <nav>
          <NavLink to="/admin/posts" className={({ isActive }) => (isActive ? 'active' : '')}>
            📝 Blog & Portfolio
          </NavLink>
          <NavLink to="/admin/images" className={({ isActive }) => (isActive ? 'active' : '')}>
            🖼 Gallery
          </NavLink>
          <NavLink to="/admin/links" className={({ isActive }) => (isActive ? 'active' : '')}>
            🔗 Links
          </NavLink>
          <NavLink to="/admin/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
            👤 Profile
          </NavLink>
        </nav>
        <div className="admin-nav-footer">
          <a href="/" className="admin-viewsite">↗ View site</a>
          <button type="button" className="btn btn-ghost" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
