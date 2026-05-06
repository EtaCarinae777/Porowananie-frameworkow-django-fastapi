import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const FASTAPI_URL = 'http://127.0.0.1:8002'
const DJANGO_URL = 'http://127.0.0.1:8001'

const ENDPOINTS = [
  {
    label: 'Logowanie',
    django: { url: '/api/token/', method: 'POST', auth: false },
    fastapi: { url: '/api/auth/login', method: 'POST', auth: false },
    isLogin: true,
  },
  {
    label: 'Lista książek',
    django: { url: '/api/books/', method: 'GET', auth: false },
    fastapi: { url: '/api/books/', method: 'GET', auth: false },
    isLogin: false,
  },
  {
    label: 'Lista wypożyczeń',
    django: { url: '/api/loans/', method: 'GET', auth: true },
    fastapi: { url: '/api/loans/', method: 'GET', auth: false },
    isLogin: false,
  },
  {
    label: 'Lista członków',
    django: { url: '/api/members/', method: 'GET', auth: true },
    fastapi: { url: '/api/members/', method: 'GET', auth: false },
    isLogin: false,
  },
]

async function runEndpointTest(baseUrl, endpoint, concurrency, email, password, token) {
  const requests = Array.from({ length: concurrency }, async () => {
    const start = performance.now()
    try {
      const options = {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
      }

      if (endpoint.method === 'POST' && endpoint.url.includes('token') || endpoint.url.includes('login')) {
        options.body = JSON.stringify({ email, password })
      }

      if (endpoint.auth && token) {
        options.headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(baseUrl + endpoint.url, options)
      return { ok: res.ok, time: Math.round(performance.now() - start) }
    } catch {
      return { ok: false, time: Math.round(performance.now() - start) }
    }
  })

  const start = performance.now()
  const responses = await Promise.all(requests)
  const totalTime = Math.round(performance.now() - start)
  const successful = responses.filter(r => r.ok)
  const times = successful.map(r => r.time)
  const avgTime = times.length
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0

  return {
    totalTime,
    successful: successful.length,
    failed: responses.length - successful.length,
    avgTime,
  }
}

function Benchmark() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [concurrency, setConcurrency] = useState(20)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [history, setHistory] = useState(() => {
  const saved = localStorage.getItem('benchmarkHistory')
  return saved ? JSON.parse(saved) : []
})

  const handleRun = async () => {
    if (!email || !password) {
      alert('Podaj email i hasło')
      return
    }

    setRunning(true)
    setResults(null)

    // najpierw zaloguj żeby mieć token do chronionych endpointów
    let djangoToken = null
    let fastapiToken = null

    try {
      const dRes = await fetch(DJANGO_URL + '/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const dData = await dRes.json()
      djangoToken = dData.access || null
    } catch {}

    try {
      const fRes = await fetch(FASTAPI_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const fData = await fRes.json()
      fastapiToken = fData.access_token || null
    } catch {}

    const endpointResults = []

    for (const ep of ENDPOINTS) {
      const [djangoResult, fastapiResult] = await Promise.all([
        runEndpointTest(DJANGO_URL, ep.django, concurrency, email, password, djangoToken),
        runEndpointTest(FASTAPI_URL, ep.fastapi, concurrency, email, password, fastapiToken),
      ])

      endpointResults.push({
        label: ep.label,
        django: djangoResult,
        fastapi: fastapiResult,
      })
    }

    setResults(endpointResults)
    setHistory(prev => {
    const updated = [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      concurrency,
      results: endpointResults,
    }]
    localStorage.setItem('benchmarkHistory', JSON.stringify(updated))
    return updated
  })
    setRunning(false)
  }

  const chartDataAvg = results?.map(r => ({
    name: r.label,
    Django: r.django.avgTime,
    FastAPI: r.fastapi.avgTime,
  }))

  const chartDataTotal = results?.map(r => ({
    name: r.label,
    Django: r.django.totalTime,
    FastAPI: r.fastapi.totalTime,
  }))

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <h2>Benchmark – Django vs FastAPI</h2>
      <p style={{ color: '#666', marginTop: '5px', marginBottom: '20px' }}>
        Każdy endpoint testowany {concurrency} równoległymi requestami
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', marginBottom: '20px' }}>
        <input
          type="email"
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label>Równoległe requesty:</label>
            <input
              type="number"
              min="5"
              max="300"
              value={concurrency}
              onChange={e => setConcurrency(Number(e.target.value))}
              style={{ width: '60px', padding: '2px 5px', borderRadius: '4px', border: '1px solid #ccc', textAlign: 'center' }}
            />
          </div>
          <input
            type="range"
            min="5"
            max="300"
            value={concurrency}
            onChange={e => setConcurrency(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <button
          onClick={handleRun}
          disabled={running}
          style={{ padding: '10px', background: running ? '#aaa' : '#4a90e2', color: 'white', border: 'none', borderRadius: '6px', cursor: running ? 'not-allowed' : 'pointer' }}
        >
          {running ? 'Testowanie...' : 'Uruchom test'}
        </button>
      </div>

      {results && (
        <>
          {/* Wykres 1 – średni czas odpowiedzi */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>Średni czas odpowiedzi (ms)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataAvg}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit=" ms" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Django" fill="#2c5f8a" />
                <Bar dataKey="FastAPI" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Wykres 2 – łączny czas */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>Łączny czas wszystkich requestów (ms)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataTotal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit=" ms" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Django" fill="#2c5f8a" />
                <Bar dataKey="FastAPI" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabelka szczegółowa */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>Szczegółowe wyniki</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={th}>Endpoint</th>
                  <th style={th}>Django avg</th>
                  <th style={th}>FastAPI avg</th>
                  <th style={th}>Django błędy</th>
                  <th style={th}>FastAPI błędy</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.label}>
                    <td style={td}>{r.label}</td>
                    <td style={td}>{r.django.avgTime} ms</td>
                    <td style={td}>{r.fastapi.avgTime} ms</td>
                    <td style={{ ...td, color: r.django.failed > 0 ? 'red' : 'inherit' }}>{r.django.failed}</td>
                    <td style={{ ...td, color: r.fastapi.failed > 0 ? 'red' : 'inherit' }}>{r.fastapi.failed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Historia testów */}
          {history.length > 0 && (
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3>Historia testów</h3>
                <button 
                  onClick={() => { setHistory([]); localStorage.removeItem('benchmarkHistory') }}
                  style={{ background: '#e24a4a', fontSize: '12px', padding: '4px 10px' }}
                >
                  Wyczyść
                </button>
              </div>
              {history.map((h, i) => (
                <p key={i} style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                  {h.timestamp} – {h.concurrency} requestów – książki: Django {h.results[1]?.django.avgTime}ms / FastAPI {h.results[1]?.fastapi.avgTime}ms
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

const th = { padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }
const td = { padding: '8px 12px', borderBottom: '1px solid #eee' }

export default Benchmark