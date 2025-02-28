import React from 'react'
import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Navbar } from "./components/Navbar"
import { Home } from "./pages/Home"
import { Footer } from "./components/Footer"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Home />
          <Footer/>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
