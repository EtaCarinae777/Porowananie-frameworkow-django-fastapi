import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // FastAPI OAuth2 domyślnie oczekuje FormData z polami username i password
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8002/api/auth/login', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // Zapisujemy token i dane użytkownika w localStorage
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Przekierowanie po udanym logowaniu
        navigate('/home');
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Błąd logowania');
      }
    } catch (error) {
      console.error("Błąd sieci:", error);
      alert("Nie udało się połączyć z serwerem");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', background: 'white', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '20px' }}>Logowanie</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px', boxSizing: 'border-box' }}
        />
        <button type="submit" style={{ width: '100%', marginBottom: '10px', padding: '10px' }}>
          Zaloguj się
        </button>
      </form>

      <p>Nie masz konta? <a href="/register">Zarejestruj się</a></p>
    </div>
  );
}

export default Login;