import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ background: '#4a90e2', padding: '10px 20px', display: 'flex', gap: '20px' }}>
      <Link to="/home" style={{ color: 'white' }}>Home</Link>
      <Link to="/search" style={{ color: 'white' }}>Szukaj</Link>
      <Link to="/loans" style={{ color: 'white' }}>Wypożyczenia</Link>
      <Link to="/account" style={{ color: 'white' }}>Konto</Link>
    </nav>
  )
}

export default Navbar