import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Navbar } from "./components/Navbar"
import { Home } from "./pages/Home"
import { Footer } from "./components/Footer"
import Questions from "./pages/Assessments/Questions"
import RoadmapPage from './pages/Assessments/Roadmap'
import Dashboard from "./pages/Dashboard/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assessment" element={<Questions />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <Footer />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App
