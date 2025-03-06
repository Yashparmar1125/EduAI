import React, { useState } from 'react';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import './Layout.css';
import { getAuth, signInWithPopup } from 'firebase/auth';
import { googleProvider } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';  // Import useDispatch from react-redux
import { login } from '../../redux/slices/authSlice';  // Import login action from your slice
import { updateUserProfile } from '../../redux/slices/userSlice';
import { googleLogin,emailLogin } from '../../api/axios.api';

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
      const auth_token = await user.getIdToken();

      // Send user information to your backend to create a session
      const response = await googleLogin(auth_token);
      
      if (response.status === 200) {
        const responseData = await response.data  // Parse the JSON here
        dispatch(login({
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          role: responseData.user.role,  // Set role from backend
        }));
        dispatch(updateUserProfile({
          name: user.displayName,
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
      const response = await emailLogin(email, password);

      if (response.status === 200) {
        const userData = response.data.user;
        // Dispatch login action to Redux store
        dispatch(login({
          name: userData.name,
          email: userData.email,
          avatar: userData.profilePicture,
          role: userData.role,
        }));
        
        // Update user profile
        dispatch(updateUserProfile({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          // Add any other user data from the response
        }));

        // Navigate based on role
        if (userData.role === "instructor") {
          navigate('/instructor/dashboard');
        } else {
          navigate('/dashboard');
        }
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
