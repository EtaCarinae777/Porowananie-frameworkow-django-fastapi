import { useNavigate } from 'react-router-dom'

function Account() {
    const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Przekierowanie na stronę logowania
  };
  const navigate = useNavigate()
  const savedUser = JSON.parse(localStorage.getItem('user'));
  return (
    <div style={{ padding: '20px' }}>
      <h2>Moje konto</h2>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginTop: '10px', maxWidth: '400px' }}>
        <p><strong>Imię:</strong> {savedUser.first_name}</p>
        <p style={{ marginTop: '8px' }}><strong>Nazwisko:</strong> {savedUser.last_name}</p>
        <p style={{ marginTop: '8px' }}><strong>Email:</strong> {savedUser.email}</p>
        <button onClick={handleLogout} style={{ marginTop: '20px', background: '#e24a4a' }}>
          Wyloguj się
        </button>
      </div>
    </div>
  )
}

export default Account