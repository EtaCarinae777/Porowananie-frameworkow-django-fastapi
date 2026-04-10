function Search() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Szukaj książek</h2>
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Tytuł, autor, gatunek..." style={{ flex: 1 }} />
        <button>Szukaj</button>
      </div>
      <p style={{ marginTop: '20px', color: '#999' }}>Brak wyników</p>
    </div>
  )
}

export default Search