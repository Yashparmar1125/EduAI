import React from 'react';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import { getAuth, signInWithPopup } from 'firebase/auth';
import { googleProvider } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { googleSignup, emailSignup } from '../../api/axios.api';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const onGoggleSignUp = async () => {
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const auth_token = await user.getIdToken();

      const response = await googleSignup(auth_token);

      if (response.status === 200) {
        const responseData = await response.data();
        dispatch(login({
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          role: responseData.user.role,
        }));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error during register", error);
    }
  };

  const handleEmailSignUp = async (formData) => {
    try {
      const response = await emailSignup(
        `${formData.firstName} ${formData.lastName}`,
        formData.email,
        formData.password
      );

      if (response.status === 200) {
        const responseData = await response.data();
        dispatch(login({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          role: responseData.newUser.role,
        }));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error during email signup:", error);
      throw new Error(error.response?.data?.message || "Failed to create account");
    }
  };

  return (
    <div className={cn(
      "flex flex-col md:flex-row w-full min-h-screen",
      theme === 'dark' 
        ? 'bg-[#0A0118]' 
        : 'bg-gradient-to-br from-[#6938EF]/5 via-[#9D7BFF]/5 to-[#6938EF]/5'
    )}>
      {/* Left Section */}
      <div className="flex-grow flex justify-center items-center p-6">
        <div className={cn(
          "w-full max-w-[480px] rounded-2xl p-8",
          theme === 'dark' 
            ? 'bg-[#110C1D] border border-[#6938EF]/20' 
            : 'bg-white border border-border'
        )}>
          <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-[0.02] rounded-2xl"></div>
          <div className="relative z-10">
            <LeftSection />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-grow flex justify-center items-center p-6">
        <RightSection onGoggleSignIn={onGoggleSignUp} onSignUp={handleEmailSignUp}/>
      </div>
    </div>
  );
};

export default Layout;
