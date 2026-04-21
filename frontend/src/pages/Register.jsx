import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { getBackend } from '../api/client'

function Register() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '' })
  const navigate = useNavigate()
  const backend = getBackend()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await register(form)
      if (data.id) {
        navigate('/')
      } else {
        alert(data.detail || 'Błąd rejestracji')
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
      <h2 style={{ marginBottom: '20px' }}>Rejestracja</h2>
      <form onSubmit={handleSubmit}>
        <input name="first_name" type="text" placeholder="Imię" onChange={handleChange} required />
        <input name="last_name" type="text" placeholder="Nazwisko" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" type="text" placeholder="Telefon (opcjonalnie)" onChange={handleChange} />
        <input name="password" type="password" placeholder="Hasło" onChange={handleChange} required />
        <button type="submit" style={{ width: '100%', marginBottom: '10px' }}>Zarejestruj się</button>
      </form>
      <p>Masz już konto? <a href="/login">Zaloguj się</a></p>
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
        <a href="/">← Zmień backend</a>
      </p>
    </div>
  )
}

export default Register