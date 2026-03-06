import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SearchResults from './pages/SearchResults'
import BookingPage from './pages/BookingPage'
import ProfilePage from './pages/ProfilePage'
import BookingsPage from './pages/BookingsPage'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogin = (u) => { setIsLoggedIn(true); setUser({ ...u, aadhaarVerified: true }) }
  const handleLogout = () => { setIsLoggedIn(false); setUser(null) }

  return (
    <LanguageProvider>
    <ThemeProvider>
      <BrowserRouter basename="/irctc-new">
        <Routes>
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/home" replace /> : <LoginPage onLogin={handleLogin} />
          } />
          <Route path="/home" element={
            isLoggedIn ? <HomePage user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />
          } />
          <Route path="/search" element={
            isLoggedIn ? <SearchResults user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />
          } />
          <Route path="/booking" element={
            isLoggedIn ? <BookingPage user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />
          } />
          <Route path="/profile" element={
            isLoggedIn ? <ProfilePage user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />
          } />
          <Route path="/bookings" element={
            isLoggedIn ? <BookingsPage user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </LanguageProvider>
  )
}
