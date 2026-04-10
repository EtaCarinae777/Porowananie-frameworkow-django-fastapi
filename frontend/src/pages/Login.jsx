import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', background: 'white', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '20px' }}>Logowanie</h2>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Hasło" />
      <button onClick={() => navigate('/home')} style={{ width: '100%', marginBottom: '10px' }}>
        Zaloguj się
      </button>
      <p>Nie masz konta? <a href="/register">Zarejestruj się</a></p>
    </div>
  )
}

export default Login