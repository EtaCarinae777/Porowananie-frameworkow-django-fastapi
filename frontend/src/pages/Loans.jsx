import { useState, useEffect } from 'react';

function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:8002/api/loans', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setLoans(data);
        } else {
          setError('Nie udało się pobrać listy wypożyczeń.');
        }
      } catch (err) {
        setError('Błąd połączenia z serwerem.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading) return <p>Ładowanie wypożyczeń...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Moje wypożyczenia: {loans.length}</h2>

      {loans.length === 0 ? (
        <p>Nie masz obecnie żadnych wypożyczonych książek.</p>
      ) : (
        <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
          {loans.map((loan) => (

            <div key={loan.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <h4>Tytuł: {loan.book.title}</h4> {}
                <p>Autor: {loan.book.author}</p>
                <p>Data wypożyczenia: {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'Brak'}</p>
                <p>Status: {loan.is_returned ? 'Zwrócona' : 'Wypożyczona'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Loans;