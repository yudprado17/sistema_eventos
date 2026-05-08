import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { EventProvider } from './context/EventContext'
import Dashboard from './pages/Dashboard'
import EventDetails from './pages/EventDetails'
import './index.css'

function App() {
  return (
    <EventProvider>
      <Router>
        <div className="relative min-h-screen">
          {/* Capa de textura de grano (Grain/Noise) para estética premium */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/event/:id" element={<EventDetails />} />
            </Routes>
          </main>
        </div>
      </Router>
    </EventProvider>
  )
}

export default App
