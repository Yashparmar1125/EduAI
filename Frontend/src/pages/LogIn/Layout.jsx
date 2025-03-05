import React, { useState } from 'react';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import './Layout.css';
import { getAuth, signInWithPopup } from 'firebase/auth';
import { googleProvider } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';  // Import useDispatch from react-redux
import { login } from '../../redux/slices/authSlice';  // Import login action from your slice

const Layout = () => {
  const dispatch = useDispatch();  // Create dispatch function to send actions to Redux
  const navigate = useNavigate(); 
  const [error, setError] = useState('');  // Handling login error state

  // Google sign-in handler
  const onGoogleSignIn = async () => {
    try {
      const auth = getAuth();  
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Send user information to your backend to create a session
      const response = await fetch('http://localhost:5000/api/auth/google/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auth_token: await user.getIdToken() }), 
      });

      if (response.ok) {
        const responseData = await response.json();  // Parse the JSON here
        // Dispatch login action to Redux store
        dispatch(login({
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          role: responseData.user.role,  // Set role from backend
        }));
        navigate('/dashboard');  // Redirect to dashboard after successful login
      }
      
    } catch (error) {
      console.error("Error during Google login", error);
      setError("Error during Google login.");
    }
  };

  // Email/password login handler
  const onLogin = async (email, password) => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Dispatch login action to Redux store after successful response
        const res = await response.json();
        dispatch(login({
          name: res.user.name,
          email: res.user.email,
          avatar: res.user.profilePicture,
          role: res.user.role,
        }));
        navigate('/dashboard');  // Redirect to dashboard after successful login
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
        {/* Pass Google Sign-In handler and login handler to RightSection */}
        <RightSection 
          onGoogleSignIn={onGoogleSignIn} 
          onLogin={onLogin} 
          error={error}  // Pass error message for display
        />
      </div>
    </div>
  );
};

export default Layout;
