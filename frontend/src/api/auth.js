import { getUrl, getBackend } from './client'

export const login = async (email, password) => {
  const backend = getBackend()
  
  if (backend === 'django') {
    const res = await fetch(getUrl() + '/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    // Django zwraca "access" nie "access_token"
    if (data.access) {
      return { access_token: data.access, user: null }
    }
    return data
  } else {
    const res = await fetch(getUrl() + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return res.json()
  }
}

export const register = async (data) => {
  const res = await fetch(getUrl() + '/api/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}