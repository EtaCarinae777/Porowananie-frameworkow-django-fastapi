import { useState, useEffect } from 'react'
import { getLoans } from '../api/loans'
import { onBackendChange, getBackend } from '../api/client'

function Loans() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backend, setBackend] = useState(getBackend())

  useEffect(() => {
    const unsubscribe = onBackendChange(b => setBackend(b))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getLoans()
        if (Array.isArray(data)) {
          setLoans(data)
        } else {
          setError('Nie udało się pobrać wypożyczeń')
        }
      } catch {
        setError('Błąd połączenia z serwerem')
      } finally {
        setLoading(false)
      }
    }
    fetchLoans()
  }, [backend])

  if (loading) return <p style={{ padding: '20px' }}>Ładowanie...</p>
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>

  return (
    <div style={{ padding: '20px' }}>
      <h2>Moje wypożyczenia: {loans.length}</h2>
      {loans.length === 0 ? (
        <p style={{ color: '#999', marginTop: '10px' }}>Brak aktywnych wypożyczeń.</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {loans.map(loan => (
            <div key={loan.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              <h4>{loan.book?.title || loan.book}</h4>
              <p style={{ color: '#666' }}>Termin zwrotu: {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'Brak'}</p>
              <p>Status: <span style={{ color: loan.is_returned ? 'green' : '#e67e22' }}>{loan.is_returned ? 'Zwrócona' : 'Wypożyczona'}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Loans