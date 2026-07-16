import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import './admin/admin.css'
import App from './App.tsx'
import Login from './admin/Login.tsx'
import AdminLayout from './admin/AdminLayout.tsx'
import PostsPanel from './admin/PostsPanel.tsx'
import ImagesPanel from './admin/ImagesPanel.tsx'
import LinksPanel from './admin/LinksPanel.tsx'
import ProfilePanel from './admin/ProfilePanel.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="posts" replace />} />
          <Route path="posts" element={<PostsPanel />} />
          <Route path="images" element={<ImagesPanel />} />
          <Route path="links" element={<LinksPanel />} />
          <Route path="profile" element={<ProfilePanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
