import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Navbar } from "./components/Navbar"
import { Home } from "./pages/Home/Home"
import { Footer } from "./components/Footer"
import Questions from "./pages/Assessments/Questions"
import RoadmapPage from './pages/Assessments/Roadmap'
import Dashboard from "./pages/Dashboard/Dashboard"
import Internships from './pages/internships/Internships'
import SignUpLayout from "./pages/SignUp/Layout"
import LogInLayout from "./pages/LogIn/Layout"
import SignUp from "./modals/SignUp"
import Login from "./modals/Login"
import InstructorDashboardpage from './pages/Instructor'
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll when modal is open
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore scroll when modal closes
  };

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll when modal is open
  };
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore scroll when modal closes
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar openModal={openModal} openLoginModal={openLoginModal}/>
          <Routes>
            <Route path="/" element={<Home  />} />
            <Route path="/signup" element={<SignUpLayout />} />
            <Route path="/login" element={<LogInLayout />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/assessment" element={<Questions />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/instructor" element={<InstructorDashboardpage />} />
          </Routes>
          <Footer />
        </div>
        {isModalOpen && <SignUp closeModal={closeModal} />} {/* Modal moved to root level */}
        {isLoginModalOpen && <Login closeModal={closeLoginModal} />}
      </Router>
    </ThemeProvider>
  );
}

export default App;
