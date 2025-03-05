import React from 'react';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import { getAuth, signInWithPopup } from 'firebase/auth';
import {  googleProvider } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';  // Import useDispatch from react-redux
import { login } from '../../redux/slices/authSlice';
import { emailSignup,googleSignup } from '../../api/axios.api';

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Create dispatch function to send actions to Redux 
  const onGoggleSignUp = async () => {
      try {
        const auth = getAuth();  // Initialize Firebase Auth
        const result = await signInWithPopup(auth, googleProvider);  // Use signInWithPopup from the modular API
        const user = result.user;
        const auth_token = await user.getIdToken();
  
        // Send user information to your backend to create a session
        const response = await googleSignup(auth_token);
  
        if (response.status === 200) {
                const responseData = await response.data();  // Parse the JSON here
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
        console.error("Error during register", error);
      }
    };
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
      {/* Left Section */}
      <div className="flex-grow flex justify-center items-center p-6">
        <LeftSection />
      </div>

      {/* Right Section */}
      <div className="flex-grow flex justify-center items-center p-6">
        <RightSection onGoggleSignIn={onGoggleSignUp}/>
      </div>
    </div>
  );
};

export default Layout;
