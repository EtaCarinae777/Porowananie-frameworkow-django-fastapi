import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Search from './pages/Search'
import Loans from './pages/Loans'
import Account from './pages/Account'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<><Navbar /><Home /></>} />
        <Route path="/search" element={<><Navbar /><Search /></>} />
        <Route path="/loans" element={<><Navbar /><Loans /></>} />
        <Route path="/account" element={<><Navbar /><Account /></>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App