import { useState, useEffect } from 'react'
import { getBooks } from '../api/books'
import { getBackend, onBackendChange } from '../api/client'

function Home() {
  const [booksCount, setBooksCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [backend, setBackend] = useState(getBackend())

  useEffect(() => {
    const unsubscribe = onBackendChange((b) => setBackend(b))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const books = await getBooks()
        if (Array.isArray(books)) {
          setBooksCount(books.length)
        }
      } catch (err) {
        console.error('Błąd pobierania statystyk:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [backend])

  return (
    <div style={{ padding: '20px' }}>
      <h2>Witaj w bibliotece!</h2>
      <p style={{ marginTop: '10px' }}>Wybierz opcję z menu nawigacji.</p>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={cardStyle}>
          <h3>Książki</h3>
          <p style={statStyle}>{loading ? '...' : booksCount}</p>
          <p style={{ color: '#666' }}>Wszystkich pozycji w bazie</p>
        </div>
        <div style={cardStyle}>
          <h3>Aktywny backend</h3>
          <p style={{ ...statStyle, fontSize: '1.5rem' }}>{backend}</p>
          <p style={{ color: '#666' }}>Aktualnie używany</p>
        </div>
      </div>
    </div>
  )
}

const cardStyle = { background: 'white', padding: '20px', borderRadius: '12px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }
const statStyle = { fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0', color: '#007bff' }

export default Home