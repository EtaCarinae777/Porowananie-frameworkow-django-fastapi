import { useNavigate } from 'react-router-dom'

function Account() {
  const navigate = useNavigate()
  const savedUser = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Moje konto</h2>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginTop: '10px', maxWidth: '400px' }}>
        <p><strong>Imię:</strong> {savedUser?.first_name || 'Brak danych'}</p>
        <p style={{ marginTop: '8px' }}><strong>Nazwisko:</strong> {savedUser?.last_name || 'Brak danych'}</p>
        <p style={{ marginTop: '8px' }}><strong>Email:</strong> {savedUser?.email || 'Brak danych'}</p>
        <button onClick={handleLogout} style={{ marginTop: '20px', background: '#e24a4a' }}>
          Wyloguj się
        </button>
      </div>
    </div>
  )
}

export default Account