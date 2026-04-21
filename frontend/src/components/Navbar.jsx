import { Link, useNavigate } from 'react-router-dom'
import { setBackend, getBackend } from '../api/client'
import { useState } from 'react'

function Navbar() {
  const navigate = useNavigate()
  const [active, setActive] = useState(getBackend())

  const handleSwitch = (backend) => {
    setBackend(backend)
    setActive(backend)
  }

  return (
    <nav style={{ background: '#4a90e2', padding: '10px 20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Link to="/home" style={{ color: 'white' }}>Home</Link>
      <Link to="/search" style={{ color: 'white' }}>Szukaj</Link>
      <Link to="/loans" style={{ color: 'white' }}>Wypożyczenia</Link>
      <Link to="/account" style={{ color: 'white' }}>Konto</Link>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ color: 'white', fontSize: '14px' }}>Backend:</span>
        <button
          onClick={() => handleSwitch('django')}
          style={{ background: active === 'django' ? '#2c5f8a' : '#6aabde' }}
        >
          Django
        </button>
        <button
          onClick={() => handleSwitch('fastapi')}
          style={{ background: active === 'fastapi' ? '#2c5f8a' : '#6aabde' }}
        >
          FastAPI
        </button>
        <button onClick={() => navigate('/')} style={{ background: '#e24a4a', marginLeft: '10px' }}>
          Wyloguj
        </button>
      </div>
    </nav>
  )
}

export default Navbar