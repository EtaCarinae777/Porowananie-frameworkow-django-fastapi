import { useNavigate } from 'react-router-dom'

function Account() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Moje konto</h2>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginTop: '10px', maxWidth: '400px' }}>
        <p><strong>Imię:</strong> Jan</p>
        <p style={{ marginTop: '8px' }}><strong>Nazwisko:</strong> Kowalski</p>
        <p style={{ marginTop: '8px' }}><strong>Email:</strong> jan@example.com</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', background: '#e24a4a' }}>
          Wyloguj się
        </button>
      </div>
    </div>
  )
}

export default Account