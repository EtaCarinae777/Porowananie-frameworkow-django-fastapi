import { useState } from 'react'

const FASTAPI_URL = 'http://127.0.0.1:8002'
const DJANGO_URL = 'http://127.0.0.1:8001'

function Benchmark() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [concurrency, setConcurrency] = useState(20)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)

  const runSingleTest = async (baseUrl, label) => {
    const isDjango = label === 'Django'

    const url = isDjango
      ? baseUrl + '/api/token/'
      : baseUrl + '/api/auth/login'

    const body = isDjango
      ? JSON.stringify({
          email,
          password,
        })
      : JSON.stringify({
          email,
          password,
        })

    const headers = {
      'Content-Type': 'application/json',
    }

    const requests = Array.from({ length: concurrency }, async () => {
      const start = performance.now()

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body,
        })

        const elapsed = Math.round(performance.now() - start)

        return {
          ok: res.ok,
          time: elapsed,
        }
      } catch (e) {
        return {
          ok: false,
          time: Math.round(performance.now() - start),
        }
      }
    })

    const start = performance.now()
    const responses = await Promise.all(requests)
    const totalTime = Math.round(performance.now() - start)

    const successful = responses.filter(r => r.ok)
    const failed = responses.filter(r => !r.ok)

    const times = successful.map(r => r.time)

    const avgTime = times.length
      ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
      : 0

    return {
      label,
      totalTime,
      successful: successful.length,
      failed: failed.length,
      avgTime,
    }
  }

  const handleRun = async () => {
    if (!email || !password) {
      alert('Podaj email i hasło')
      return
    }

    setRunning(true)
    setResults(null)

    const [fastapi, django] = await Promise.all([
      runSingleTest(FASTAPI_URL, 'FastAPI'),
      runSingleTest(DJANGO_URL, 'Django'),
    ])

    setResults({ fastapi, django })
    setRunning(false)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '700px' }}>
      <h2>Benchmark</h2>


      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
        />

        <div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <label style={{ color: '#444' }}>
      Równoległe requesty:
    </label>

    {/* Pole do wpisywania "z łapy" */}
    <input
      type="number"
      min="5"
      max="300"
      value={concurrency}
      onChange={e => setConcurrency(Number(e.target.value))}
      style={{
        width: '60px',
        padding: '2px 5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        textAlign: 'center'
      }}
    />
  </div>

  {/* Twój obecny suwak */}
  <input
    type="range"
    min="5"
    max="300"
    step="1"
    value={concurrency}
    onChange={e => setConcurrency(Number(e.target.value))}
    style={{ width: '100%', marginTop: '6px' }}
  />
</div>

        <button
          onClick={handleRun}
          disabled={running}
          style={{
            padding: '10px',
            background: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: running ? 'not-allowed' : 'pointer',
          }}
        >
          {running ? 'Testowanie...' : 'Uruchom test'}
        </button>
      </div>

      {results && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginTop: '20px',
          }}
        >
          {[results.fastapi, results.django].map(r => (
            <div
              key={r.label}
              style={{
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <h3 style={{ marginBottom: '12px', color: '#4a90e2' }}>
                {r.label}
              </h3>

              <p>
                Łączny czas: <strong>{r.totalTime} ms</strong>
              </p>

              <p>
                Udane:{' '}
                <strong style={{ color: 'green' }}>{r.successful}</strong>
              </p>

              <p>
                Błędy:{' '}
                <strong style={{ color: r.failed > 0 ? 'red' : 'inherit' }}>
                  {r.failed}
                </strong>
              </p>

              <p>
                Avg czas odpowiedzi: <strong>{r.avgTime} ms</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Benchmark