import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store/store';
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

function App() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6938EF]"></div>
          </div>
        } 
        persistor={persistor}
        onBeforeLift={() => {
          console.log('Before lifting state...');
        }}
        onAfterLift={() => {
          console.log('After lifting state...');
          // Log the persisted state
          const state = store.getState();
          console.log('Persisted Auth State:', state.auth);
          console.log('Persisted User State:', state.user);
        }}
      >
        <ThemeProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUpLayout />} />
                <Route path="/login" element={<LogInLayout />} />
                <Route path="/internships" element={<Internships />} />
                
                {/* Protected Routes */}
                <Route path="/assessment" element={<ProtectedRoute element={<Questions />} />} />
                <Route path="/roadmap" element={<ProtectedRoute element={<RoadmapPage />} />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/achievements" element={<ProtectedRoute element={<Achievements />} />} />
                <Route path="/course" element={<ProtectedRoute element={<CourseOverview />} />} />
                <Route path="/learning" element={<ProtectedRoute element={<CourseLearning />} />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
