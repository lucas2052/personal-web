import { api } from './api/client'

let authenticated = false

// Remove credentials saved by the previous Basic Auth implementation.
localStorage.removeItem('luca-admin-auth')

export async function checkSession(): Promise<boolean> {
  try {
    await api.get('/api/auth/me')
    authenticated = true
  } catch {
    authenticated = false
  }
  return authenticated
}

export async function login(username: string, password: string): Promise<void> {
  await api.post('/api/auth/login', { username, password })
  authenticated = true
}

export async function logout(): Promise<void> {
  try {
    await api.post('/api/auth/logout')
  } finally {
    authenticated = false
  }
}
