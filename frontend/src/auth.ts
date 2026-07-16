import { api } from './api/client'

const STORAGE_KEY = 'luca-admin-auth'

/** Put the HTTP Basic header on the axios instance for all future requests. */
function applyHeader(basic: string | null) {
  if (basic) {
    api.defaults.headers.common.Authorization = `Basic ${basic}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

// Restore a previous session on page load.
const saved = localStorage.getItem(STORAGE_KEY)
if (saved) applyHeader(saved)

export function isLoggedIn(): boolean {
  return localStorage.getItem(STORAGE_KEY) != null
}

/** Verify credentials against /api/auth/me. Persists them only if they work. */
export async function login(username: string, password: string): Promise<void> {
  const basic = btoa(`${username}:${password}`)
  applyHeader(basic)
  try {
    await api.get('/api/auth/me')
    localStorage.setItem(STORAGE_KEY, basic)
  } catch (err) {
    applyHeader(localStorage.getItem(STORAGE_KEY)) // roll back to prior state
    throw err
  }
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY)
  applyHeader(null)
}
