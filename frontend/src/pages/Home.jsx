import { useState, useEffect } from "react";

function Home() {
  const [stats, setStats] = useState({ booksCount: 0, loansCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        // Pobieramy książki, żeby znać ich liczbę
        const booksRes = await fetch('http://localhost:8002/api/books/');
        const booksData = await booksRes.json();

        // Pobieramy wypożyczenia (jeśli mamy token)
        let loansData = [];
        if (token) {
          const loansRes = await fetch('http://localhost:8002/api/loans', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (loansRes.ok) loansData = await loansRes.json();
        }

        setStats({
          booksCount: booksData.length,
          loansCount: loansData.filter(l => !l.is_returned).length // Tylko aktywne
        });
      } catch (err) {
        console.error("Błąd pobierania statystyk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Witaj w bibliotece!</h2>
      <p style={{ marginTop: '10px' }}>Wybierz opcję z menu nawigacji, aby zarządzać zasobami.</p>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* Karta Książek */}
        <div style={cardStyle}>
          <h3>Książki</h3>
          <p style={statStyle}>{loading ? '...' : stats.booksCount}</p>
          <p style={{ color: '#666' }}>Wszystkich pozycji w bazie</p>
        </div>

        {/* Karta Wypożyczeń */}
        <div style={cardStyle}>
          <h3>Twoje wypożyczenia</h3>
          <p style={statStyle}>{loading ? '...' : stats.loansCount}</p>
          <p style={{ color: '#666' }}>Aktualnie u Ciebie</p>
        </div>
      </div>
    </div>
  );
}

// Style pomocnicze
const cardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  flex: 1,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const statStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  margin: '10px 0',
  color: '#007bff'
};

export default Home;