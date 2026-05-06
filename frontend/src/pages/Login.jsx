import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { getBackend } from '../api/client'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const backend = getBackend()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const data = await login(email, password)
      if (data.access_token) {
        localStorage.setItem('token', data.access_token)

        // pobierz dane użytkownika z /api/me/
        const meRes = await fetch(`http://localhost:8001/api/me/`, {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        })
        if (meRes.ok) {
          const meData = await meRes.json()
          localStorage.setItem('user', JSON.stringify(meData))
        } else {
          localStorage.setItem('user', JSON.stringify({ email }))
        }

        navigate('/home')
      } else {
        alert(data.detail || 'Błąd logowania')
      }
    } catch (err) {
      alert('Nie udało się połączyć z serwerem')
    }
  }
  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', background: 'white', borderRadius: '8px' }}>
      <div style={{ background: backend === 'django' ? '#2c5f8a' : '#4CAF50', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', marginBottom: '16px', display: 'inline-block' }}>
        Backend: {backend}
      </div>
      <h2 style={{ marginBottom: '20px' }}>Logowanie</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={{ width: '100%', marginBottom: '10px' }}>Zaloguj się</button>
      </form>
      <p>Nie masz konta? <a href="/register">Zarejestruj się</a></p>
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
        <a href="/">← Zmień backend</a>
      </p>
    </div>
  )
}

export default Login