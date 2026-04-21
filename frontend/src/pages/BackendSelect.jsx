import { useNavigate } from 'react-router-dom'
import { setBackend } from '../api/client'

function BackendSelect() {
  const navigate = useNavigate()

  const handleSelect = (backend) => {
    setBackend(backend)
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: '400px', margin: '150px auto', padding: '30px', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '10px' }}>System Biblioteki</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>Wybierz backend przed rozpoczęciem</p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button
          onClick={() => handleSelect('django')}
          style={{ padding: '15px 30px', fontSize: '16px', background: '#2c5f8a', borderRadius: '8px' }}
        >
          Django
        </button>
        <button
          onClick={() => handleSelect('fastapi')}
          style={{ padding: '15px 30px', fontSize: '16px', background: '#4CAF50', borderRadius: '8px' }}
        >
          FastAPI
        </button>
      </div>
    </div>
  )
}

export default BackendSelect