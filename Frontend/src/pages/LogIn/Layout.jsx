import React ,{useState}from 'react';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import './Layout.css';
import { getAuth, signInWithPopup } from 'firebase/auth';
import {  googleProvider } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory

const Layout = () => {
  const navigate = useNavigate();  // Use useNavigate for navigation
  const [error, setError] = useState('');

  const onGoggleSignIn = async () => {
    try {
      const auth = getAuth();  // Initialize Firebase Auth
      const result = await signInWithPopup(auth, googleProvider);  // Use signInWithPopup from the modular API
      const user = result.user;
      console.log(user);

      // Send user information to your backend to create a session
      const response = await fetch('http://localhost:5000/api/auth/google/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auth_token: await user.getIdToken() }), // Send Firebase token to the backend
      });

      if (response.ok) {
        navigate('/dashboard'); // Redirect to a protected route
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };
  const onLogin = async (email, password) => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {

      // Send user information to your backend to create a session
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate('/dashboard'); // Redirect to a protected route
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-background/95">
      <div className="flex-grow flex justify-center items-center">
        <LeftSection />
      </div>
      <div className="flex-grow flex justify-center items-center">
        <RightSection onGoggleSignIn={onGoggleSignIn} onLogin={onLogin} />
      </div>
    </div>
  );
};

export default Layout;
