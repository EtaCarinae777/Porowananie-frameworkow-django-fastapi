import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Search from './pages/Search'
import Loans from './pages/Loans'
import Account from './pages/Account'
import BackendSelect from './pages/BackendSelect'
import Benchmark from './pages/Benchmark'
import Navbar from './components/Navbar'
import { getBackend } from './api/client'

function ProtectedRoute({ children }) {
  const backend = getBackend()
  const token = localStorage.getItem('token')
  if (!backend) return <Navigate to="/" />
  if (!token) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BackendSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoute><Navbar /><Home /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Navbar /><Search /></ProtectedRoute>} />
        <Route path="/loans" element={<ProtectedRoute><Navbar /><Loans /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Navbar /><Account /></ProtectedRoute>} />
        <Route path="/benchmark" element={<ProtectedRoute><Navbar /><Benchmark /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App