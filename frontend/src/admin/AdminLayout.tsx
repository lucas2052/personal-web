import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom'
import { isLoggedIn, logout } from '../auth'

export default function AdminLayout() {
  const navigate = useNavigate()

  if (!isLoggedIn()) return <Navigate to="/login" replace />

  const signOut = () => {
    logout()
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
          <button type="button" className="btn btn-ghost" onClick={signOut}>
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
