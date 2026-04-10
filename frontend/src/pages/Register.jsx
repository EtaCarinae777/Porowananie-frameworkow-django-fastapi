import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', background: 'white', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '20px' }}>Rejestracja</h2>
      <input type="text" placeholder="Imię" />
      <input type="text" placeholder="Nazwisko" />
      <input type="email" placeholder="Email" />
      <input type="text" placeholder="Telefon (opcjonalnie)" />
      <input type="password" placeholder="Hasło" />
      <button onClick={() => navigate('/home')} style={{ width: '100%', marginBottom: '10px' }}>
        Zarejestruj się
      </button>
      <p>Masz już konto? <a href="/">Zaloguj się</a></p>
    </div>
  )
}

export default Register