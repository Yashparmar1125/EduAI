import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import { Home } from './pages/Home/Home';
import { Footer } from './components/Footer';
import Questions from './pages/Assessments/Questions';
import RoadmapPage from './pages/Assessments/Roadmap';
import Dashboard from './pages/Dashboard/Dashboard';
import Achievements from './pages/Dashboard/Achievements';
import CourseOverview from './pages/Dashboard/CourseOverview';
import Internships from './pages/internships/Internships';
import SignUpLayout from './pages/SignUp/Layout';
import LogInLayout from './pages/LogIn/Layout';
import SignUp from './modals/SignUp';
import Login from './modals/Login';
import { Navbar } from './components/navbar';
import CourseLearning from './pages/Dashboard/CourseLearning';
import ProtectedRoute from './components/ProtectedRoute';
import CreateCourse from './pages/Instructor/CreateCourse';
import ManageCourses from './pages/Instructor/ManageCourses';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUpLayout />} />
            <Route path="/login" element={<LogInLayout />} />
            <Route path="/internships" element={<Internships />} />
            
            <Route path="/instructor/courses" element={<ManageCourses />} />
            <Route path="/instructor/courses/create" element={<CreateCourse />} />
            

            {/* Protected Routes */}
            <Route path="/assessment" element={<ProtectedRoute element={<Questions />} />} />
            <Route path="/roadmap" element={<ProtectedRoute element={<RoadmapPage />} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            {/* <Route path="/instructor" element={<ProtectedRoute element={<InstructorDashboardpage />} />}/> */}
            <Route path="/achievements" element={<ProtectedRoute element={<Achievements />} />} />
            <Route path="/course" element={<ProtectedRoute element={<CourseOverview />} />} />
            <Route path="/learning" element={<ProtectedRoute element={<CourseLearning />} />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
