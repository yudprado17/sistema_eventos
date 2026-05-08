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
        <main className="animate-fade">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/event/:id" element={<EventDetails />} />
          </Routes>
        </main>
      </Router>
    </EventProvider>
  )
}

export default App
