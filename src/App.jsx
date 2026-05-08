import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { EventProvider } from './context/EventContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import EventDetails from './pages/EventDetails'
import Login from './pages/Login'
import './index.css'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="matrix-container"><div className="matrix-text-glow">CARGANDO...</div></div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <div className="relative min-h-screen">
            {/* Capa de textura de grano (Grain/Noise) para estética premium */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            
            <main>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/event/:id" 
                  element={
                    <ProtectedRoute>
                      <EventDetails />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
        </Router>
      </EventProvider>
    </AuthProvider>
  )
}

export default App
