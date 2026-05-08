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
  {
    label: 'Aktualizacja książki (PUT)',
    django: { url: '/api/books/1/', method: 'PUT', auth: true, body: { title: 'Test PUT', author: 'Autor', is_available: true } },
    fastapi: { url: '/api/books/1', method: 'PUT', auth: true, body: { title: 'Test PUT', author: 'Autor', is_available: true } },
    isLogin: false,
  },
]

function calcPercentile(times, p) {
  const sorted = [...times].sort((a, b) => a - b)
  const idx = Math.floor(sorted.length * p)
  return Math.round(sorted[Math.min(idx, sorted.length - 1)])
}

async function runEndpointTest(baseUrl, endpoint, concurrency, email, password, token) {
  const startBenchmark = performance.now()

  const requests = Array.from({ length: concurrency }, async () => {
    const startReq = performance.now()
    try {
      const options = {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
      }

      if (endpoint.method === 'POST' && (endpoint.url.includes('token') || endpoint.url.includes('login'))) {
        options.body = JSON.stringify({ email, password })
      }

      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body)
      }

      if (endpoint.auth && token) {
        options.headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(baseUrl + endpoint.url, options)
      const ok = res.ok

      // Konsumujemy body, aby upewnić się, że request został w pełni zakończony
      await res.json().catch(() => {})

      return { ok, time: performance.now() - startReq }
    } catch {
      return { ok: false, time: performance.now() - startReq }
    }
  })

  const responses = await Promise.all(requests)
  const totalTime = Math.round(performance.now() - startBenchmark)

  const successful = responses.filter(r => r.ok)
  const successTimes = successful.map(r => r.time)

  const avgTime = successTimes.length
    ? Math.round(successTimes.reduce((a, b) => a + b, 0) / successTimes.length)
    : 0

  const p50 = successTimes.length ? calcPercentile(successTimes, 0.50) : 0
  const p95 = successTimes.length ? calcPercentile(successTimes, 0.95) : 0
  const p99 = successTimes.length ? calcPercentile(successTimes, 0.99) : 0

  return {
    totalTime,
    successful: successful.length,
    failed: responses.length - successful.length,
    avgTime,
    p50,
    p95,
    p99,
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

    // Logika rozgrzewki (warm-up)
    try {
      await fetch(DJANGO_URL + '/api/books/', { method: 'GET' }).catch(() => {})
      await fetch(FASTAPI_URL + '/api/books/', { method: 'GET' }).catch(() => {})
    } catch {}

    let djangoToken = null
    let fastapiToken = null

    // Pobieranie tokenów początkowych
    try {
      const [dRes, fRes] = await Promise.all([
        fetch(DJANGO_URL + '/api/token/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }),
        fetch(FASTAPI_URL + '/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
      ])
      const dData = await dRes.json()
      const fData = await fRes.json()
      djangoToken = dData.access || null
      fastapiToken = fData.access_token || null
    } catch {}

    const endpointResults = []

    for (const ep of ENDPOINTS) {
      // Testujemy frameworki sekwencyjnie, by nie obciążać CPU naraz dwoma serwerami
      const djangoResult = await runEndpointTest(DJANGO_URL, ep.django, concurrency, email, password, djangoToken)
      const fastapiResult = await runEndpointTest(FASTAPI_URL, ep.fastapi, concurrency, email, password, fastapiToken)

      endpointResults.push({
        label: ep.label,
        django: djangoResult,
        fastapi: fastapiResult,
      })
    }

    setResults(endpointResults)
    setHistory(prev => {
      const updated = [{
        timestamp: new Date().toLocaleTimeString(),
        concurrency,
        results: endpointResults,
      }, ...prev].slice(0, 10)
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

  const chartDataP95 = results?.map(r => ({
    name: r.label,
    Django: r.django.p95,
    FastAPI: r.fastapi.p95,
  }))

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <h2>Benchmark – Django vs FastAPI</h2>
      <p style={{ color: '#666', marginTop: '5px', marginBottom: '20px' }}>
        Każdy endpoint testowany {concurrency} równoległymi requestami (sekwencyjnie per framework)
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

          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>P95 – czas odpowiedzi (ms)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataP95}>
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

          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>Szczegółowe wyniki</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={th}>Endpoint</th>
                  <th style={th}>Django avg</th>
                  <th style={th}>Django P50</th>
                  <th style={th}>Django P95</th>
                  <th style={th}>Django P99</th>
                  <th style={th}>FastAPI avg</th>
                  <th style={th}>FastAPI P50</th>
                  <th style={th}>FastAPI P95</th>
                  <th style={th}>FastAPI P99</th>
                  <th style={th}>Django błędy</th>
                  <th style={th}>FastAPI błędy</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.label}>
                    <td style={td}>{r.label}</td>
                    <td style={td}>{r.django.avgTime} ms</td>
                    <td style={td}>{r.django.p50} ms</td>
                    <td style={td}>{r.django.p95} ms</td>
                    <td style={td}>{r.django.p99} ms</td>
                    <td style={td}>{r.fastapi.avgTime} ms</td>
                    <td style={td}>{r.fastapi.p50} ms</td>
                    <td style={td}>{r.fastapi.p95} ms</td>
                    <td style={td}>{r.fastapi.p99} ms</td>
                    <td style={{ ...td, color: r.django.failed > 0 ? 'red' : 'inherit' }}>{r.django.failed}</td>
                    <td style={{ ...td, color: r.fastapi.failed > 0 ? 'red' : 'inherit' }}>{r.fastapi.failed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {history.length > 0 && (
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3>Historia testów</h3>
                <button
                  onClick={() => { setHistory([]); localStorage.removeItem('benchmarkHistory') }}
                  style={{ background: '#e24a4a', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', padding: '4px 10px', cursor: 'pointer' }}
                >
                  Wyczyść
                </button>
              </div>
              {history.map((h, i) => (
                <p key={i} style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                  {h.timestamp} – {h.concurrency} requestów – logowanie: D {h.results[0]?.django.avgTime}ms / F {h.results[0]?.fastapi.avgTime}ms
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