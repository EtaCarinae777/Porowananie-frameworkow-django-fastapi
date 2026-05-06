import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUrl, getBackend, onBackendChange } from '../api/client'

function Account() {
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {})
  const [backend, setBackend] = useState(getBackend())

  useEffect(() => {
    const unsubscribe = onBackendChange(b => setBackend(b))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      try {
        // FastAPI ma endpoint /api/auth/me
        if (backend === 'fastapi') {
          const res = await fetch(getUrl() + '/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setUser(data)
            localStorage.setItem('user', JSON.stringify(data))
          }
        }
      } catch {}
    }
    fetchUser()
  }, [backend])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Moje konto</h2>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginTop: '10px', maxWidth: '400px' }}>
        <p><strong>Imię:</strong> {user?.first_name || 'Brak danych'}</p>
        <p style={{ marginTop: '8px' }}><strong>Nazwisko:</strong> {user?.last_name || 'Brak danych'}</p>
        <p style={{ marginTop: '8px' }}><strong>Email:</strong> {user?.email || 'Brak danych'}</p>
        <p style={{ marginTop: '8px', color: '#999', fontSize: '13px' }}>Backend: {backend}</p>
        <button onClick={handleLogout} style={{ marginTop: '20px', background: '#e24a4a' }}>
          Wyloguj się
        </button>
      </div>
    </div>
  )
}

export default Account