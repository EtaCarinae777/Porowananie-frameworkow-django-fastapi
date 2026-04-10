function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Witaj w bibliotece!</h2>
      <p style={{ marginTop: '10px' }}>Wybierz opcję z menu nawigacji.</p>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', flex: 1 }}>
          <h3>Książki</h3>
          <p>Łącznie: 0</p>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', flex: 1 }}>
          <h3>Moje wypożyczenia</h3>
          <p>Aktywne: 0</p>
        </div>
      </div>
    </div>
  )
}

export default Home