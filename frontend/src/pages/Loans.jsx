import { useState, useEffect } from 'react'
import { getLoans } from '../api/loans'

function Loans() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getLoans()
        setLoans(data)
      } catch (err) {
        setError('Błąd połączenia z serwerem.')
      } finally {
        setLoading(false)
      }
    }
    fetchLoans()
  }, [])

  if (loading) return <p style={{ padding: '20px' }}>Ładowanie...</p>
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>

  return (
    <div style={{ padding: '20px' }}>
      <h2>Moje wypożyczenia: {loans.length}</h2>
      {loans.length === 0 ? (
        <p style={{ color: '#999', marginTop: '10px' }}>Nie masz obecnie żadnych wypożyczonych książek.</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {loans.map(loan => (
            <div key={loan.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              <h4>{loan.book.title}</h4>
              <p style={{ color: '#666' }}>Autor: {loan.book.author}</p>
              <p>Termin zwrotu: {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'Brak'}</p>
              <p>Status: <span style={{ color: loan.is_returned ? 'green' : '#e67e22' }}>{loan.is_returned ? 'Zwrócona' : 'Wypożyczona'}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Loans