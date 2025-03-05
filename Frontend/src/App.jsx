import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import SignUpLayout from "./pages/SignUp/Layout" // Update import path for SignUp Layout component
import LogInLayout from "./pages/LogIn/Layout" // Import LogIn Layout component
import TopSection from "./pages/LandingPage/TopSection" // Import TopSection component

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <ConditionalNavbar />
          <Routes>
            <Route path="/signup" element={<SignUpLayout />} /> {/* Add route for SignUp Layout */}
            <Route path="/login" element={<LogInLayout />} /> {/* Add route for LogIn Layout */}
            <Route path="/" element={<TopSection />} /> {/* Add route for TopSection */}
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

function ConditionalNavbar() {
  const location = useLocation();
  return location.pathname !== '/signup' && location.pathname !== '/login' ? <Navbar /> : null;
}

export default App
