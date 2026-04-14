import { useState } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      // Zakładamy, że masz endpoint GET /api/books/?search=...
      // Jeśli nie, na razie pobierzemy wszystkie i przefiltrujemy na froncie
      const response = await fetch(`http://localhost:8002/api/books/`);
      const data = await response.json();

      const filtered = data.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.genre.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filtered);
    } catch (err) {
      console.error("Błąd wyszukiwania:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoan = async (bookId) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      alert("Musisz się zalogować, aby wypożyczyć książkę!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8002/api/loans/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          book_id: bookId,
          member_id: user.id // Zakładamy, że user ma pole id
        })
      });

      if (response.ok) {
        alert("Książka wypożyczona pomyślnie!");
        handleSearch(); // Odśwież listę, żeby pokazać, że książka jest już zajęta
      } else {
        const errData = await response.json();
        alert(`Błąd: ${errData.detail || "Nie udało się wypożyczyć"}`);
      }
    } catch (err) {
      alert("Błąd połączenia z serwerem.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Szukaj książek</h2>
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Tytuł, autor, gatunek..."
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {loading ? 'Szukanie...' : 'Szukaj'}
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {results.length > 0 ? (
          results.map((book) => (
            <div key={book.id} style={{
              background: 'white',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div>
                <h4 style={{ margin: 0 }}>{book.title}</h4>
                <p style={{ margin: '5px 0', color: '#666' }}>{book.author} | {book.genre}</p>
                <small style={{ color: book.is_available ? 'green' : 'red' }}>
                  {book.is_available ? '● Dostępna' : '● Wypożyczona'}
                </small>
              </div>

              <button
                onClick={() => handleLoan(book.id)}
                disabled={!book.is_available}
                style={{
                  padding: '8px 15px',
                  backgroundColor: book.is_available ? '#4CAF50' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: book.is_available ? 'pointer' : 'not-allowed'
                }}
              >
                Wypożycz
              </button>
            </div>
          ))
        ) : (
          !loading && <p style={{ color: '#999' }}>Brak wyników. Wpisz coś i naciśnij Szukaj.</p>
        )}
      </div>
    </div>
  )
}

export default Search