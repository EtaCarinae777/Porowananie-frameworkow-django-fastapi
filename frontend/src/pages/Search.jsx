import { useState } from 'react'
import { getBooks } from '../api/books'
import { createLoan } from '../api/loans'

function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    try {
      const data = await getBooks()
      const filtered = data.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        (book.genre && book.genre.toLowerCase().includes(query.toLowerCase()))
      )
      setResults(filtered)
    } catch (err) {
      console.error('Błąd wyszukiwania:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLoan = async (bookId) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) { alert('Musisz się zalogować!'); return }
    try {
    const res = await createLoan({ bookId: bookId, memberId: user.id })
      if (res.id) {
        alert('Książka wypożyczona!')
        handleSearch()
      } else {
        alert(res.detail || 'Nie udało się wypożyczyć')
      }
    } catch (err) {
      alert('Błąd połączenia z serwerem')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Szukaj książek</h2>
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Tytuł, autor, gatunek..." style={{ flex: 1 }} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        <button onClick={handleSearch}>{loading ? 'Szukanie...' : 'Szukaj'}</button>
      </div>
      <div style={{ marginTop: '20px' }}>
        {results.length > 0 ? results.map(book => (
          <div key={book.id} style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>{book.title}</h4>
              <p style={{ margin: '5px 0', color: '#666' }}>{book.author} | {book.genre}</p>
              <small style={{ color: book.is_available ? 'green' : 'red' }}>
                {book.is_available ? '● Dostępna' : '● Wypożyczona'}
              </small>
            </div>
            <button onClick={() => handleLoan(book.id)} disabled={!book.is_available} style={{ backgroundColor: book.is_available ? '#4CAF50' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 15px', cursor: book.is_available ? 'pointer' : 'not-allowed' }}>
              Wypożycz
            </button>
          </div>
        )) : !loading && <p style={{ color: '#999' }}>Brak wyników. Wpisz coś i naciśnij Szukaj.</p>}
      </div>
    </div>
  )
}

export default Search