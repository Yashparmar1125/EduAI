import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store/store';
import { Footer } from './components/Footer';
import Questions from './pages/Assessments/Questions';
import RoadmapPage from './pages/Assessments/Roadmap';
import Dashboard from './pages/Dashboard/Dashboard';
import Achievements from './pages/Dashboard/Achievements';
import CourseOverview from './pages/Dashboard/CourseOverview';
import Internships from './pages/internships/Internships';
import SignUpLayout from './pages/SignUp/Layout';
import LogInLayout from './pages/LogIn/Layout';
import { Navbar } from './components/navbar';
import CourseLearning from './pages/Dashboard/CourseLearning';
import ProtectedRoute from './components/ProtectedRoute';
import CreateCourse from './pages/Instructor/CreateCourse';
import ManageCourses from './pages/Instructor/ManageCourses';

import InstructorDashboard from './pages/Instructor/InstructorDashboard';
import CreateAssessment from './pages/Instructor/CreateAssessment';
import CourseDetails from './pages/Instructor/CourseDetails';
import EditCourse from './pages/Instructor/EditCourse';
import Assessments from './pages/Instructor/Assessments';
import InstructorLayout from './components/layouts/InstructorLayout';
import { ToastProvider } from './components/ui/toast';
import AssessmentDetails from './pages/Instructor/AssessmentDetails';
import EditAssessment from './pages/Instructor/EditAssessment';
import ExploreCourses from './pages/ExploreCourses/ExploreCourses';

import LandingPage from './pages/LandingPage/MainPage';
import NotFound from './components/NotFound';

import TopSection from './pages/Community/TopSection';
import CommunityLayout from './pages/CommunityLayout';

import Certificate from "../src/pages/Instructor/Certificate"
import CertificateVerify from './pages/Instructor/CertificateVerify';
import PersonalizedCourses from './pages/PersonalizedCourses/PersonalizedCourses';
import PersonalizedCourseLearning from './pages/PersonalizedCourses/PersonalizedCourseLearning';

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
          <ToastProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/signup" element={<SignUpLayout />} />
                  <Route path="/login" element={<LogInLayout />} />
                  <Route path="/internships" element={<Internships />} />

                  {/* Instructor Routes with Layout */}
                  <Route
                    path="/instructor/courses"
                    element={
                      <ProtectedRoute
                        element={
                          <InstructorLayout>
                            <ManageCourses />
                          </InstructorLayout>
                        }
                      />
                    }
                  />
                  
                  <Route
                    path="/instructor/courses/create"
                    element={
                      <ProtectedRoute
                        element={
                          <InstructorLayout>
                            <CreateCourse />
                          </InstructorLayout>
                        }
                      />
                    }
                  />
                  <Route
                    path="/instructor/courses/:courseId"
                    element={
                      <ProtectedRoute
                        element={
                          <InstructorLayout>
                            <CourseDetails />
                          </InstructorLayout>
                        }
                      />
                    }
                  />
                  <Route
                    path="/instructor/courses/:courseId/edit"
                    element={
                      <ProtectedRoute
                        element={
                          <InstructorLayout>
                            <EditCourse />
                          </InstructorLayout>
                        }
                      />
                    }
                  />
                  <Route
                    path="/instructor/dashboard"
                    element={
                      <ProtectedRoute
                        element={
                          <InstructorLayout>
                            <InstructorDashboard />
                          </InstructorLayout>
                        }
                      />
                    }
                  />
                  <Route
                    path="/instructor/certificate"
                    element={
                      <ProtectedRoute
                        element={
                         
                            <Certificate/>
                        }
                      />
                    }
                  />
                  <Route
                    path="/instructor/certificate/verify"
                    element={
                      <ProtectedRoute
                        element={
                         
                            <CertificateVerify/>
                          
                        }
                      />
                    }
                    />
                  <Route
                    path="/instructor/assessments"
                    element={
                      <ProtectedRoute
                        element={
                          <InstructorLayout>
                            <Assessments />
                          </InstructorLayout>
                        }
                      />
                    }
                  />
                  <Route
                    path="/instructor/assessments/create"
                    element={
                      <ProtectedRoute
                        element={
                          <InstructorLayout>
                            <CreateAssessment />
                          </InstructorLayout>
                        }
                      />
                    }
                  />
                  <Route
                    path="/instructor/assessments/:assessmentId"
                    element={
                      <ProtectedRoute
                        element={
                          <InstructorLayout>
                            <AssessmentDetails />
                          </InstructorLayout>
                        }
                      />
                    }
                  />
                  <Route
                    path="/instructor/assessments/:assessmentId/edit"
                    element={
                      <ProtectedRoute
                        element={
                          <InstructorLayout>
                            <EditAssessment />
                          </InstructorLayout>
                        }
                      />
                    }
                  />

                  {/* Protected Routes */}
                  <Route path="/assessment" element={<ProtectedRoute element={<Questions />} />} />
                  <Route path="/community" element={<TopSection />} /> {/* Add route for TopSection */}
                  <Route path="/community/queries" element={<CommunityLayout />} />
                  <Route path="/roadmap" element={<ProtectedRoute element={<RoadmapPage />} />} />
                  <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                  <Route path="/dashboard/course/:courseId" element={<CourseOverview />} />
                  <Route path="/achievements" element={<ProtectedRoute element={<Achievements />} />} />
                  <Route path="/course" element={<ProtectedRoute element={<CourseOverview />} />} />
                  <Route path="/learning/:courseId" element={<ProtectedRoute element={<CourseLearning />} />} />
                  <Route path="/explore" element={<ProtectedRoute element={<ExploreCourses />} />} />
                  <Route path="/personalized" element={<PersonalizedCourses />} />
                  <Route path="/personalized/:courseId" element={<PersonalizedCourseLearning />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
              </div>
            </Router>
          </ToastProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
