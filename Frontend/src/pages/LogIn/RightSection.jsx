import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";

const RightSection = ({ defaultData = {}, onGoogleSignIn, onLogin,onGithubLogin, error }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: defaultData.email || '',
    password: defaultData.password || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await onLogin(formData.email, formData.password);
      } catch (error) {
        setErrors({ submit: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="min-w-[256px] flex justify-center items-center p-8 w-full max-w-[480px]"
    >
      <div className={cn(
        "bg-card rounded-2xl p-12 w-full shadow-lg border",
        theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
      )}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "text-4xl font-bold text-center mb-2",
            theme === 'dark' ? 'text-white' : 'text-foreground'
          )}
        >
          Welcome Back
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-base text-center mb-8 text-muted-foreground"
        >
          Sign in to continue your learning journey
        </motion.p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-background border-2 transition-all duration-200",
                  "focus:outline-none focus:border-[#6938EF] focus:ring-2 focus:ring-[#6938EF]/20",
                  errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input",
                  theme === 'dark' ? 'bg-[#1A1425] text-white' : 'bg-white text-foreground'
                )}
                aria-describedby="emailError"
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <span id="emailError" className="text-sm text-red-500">{errors.email}</span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-background border-2 transition-all duration-200",
                  "focus:outline-none focus:border-[#6938EF] focus:ring-2 focus:ring-[#6938EF]/20",
                  errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input",
                  theme === 'dark' ? 'bg-[#1A1425] text-white' : 'bg-white text-foreground'
                )}
                aria-describedby="passwordError"
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && (
                <span id="passwordError" className="text-sm text-red-500">{errors.password}</span>
              )}
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className={cn(
                "w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200",
                "bg-[#6938EF] hover:bg-[#5B2FD1] focus:outline-none focus:ring-2 focus:ring-[#6938EF]/20",
                "disabled:opacity-70 disabled:cursor-not-allowed",
                loading ? "flex items-center justify-center" : ""
              )}
              disabled={loading}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </motion.div>
        </form>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 border-t border-border"></div>
            <span className="relative px-4 text-sm text-muted-foreground bg-card">
              Or continue with
            </span>
          </div>
          <div className="flex justify-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200",
                "hover:bg-accent/50",
                theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
              )}
              onClick={onGoogleSignIn}
              aria-label="Sign in with Google"
            >
              <FaGoogle className="text-xl text-[#ea4335]" />
              <span className="text-sm font-medium">Google</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200",
                "hover:bg-accent/50",
                theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
              )}
              aria-label="Sign in with Facebook"
              onClick={onGithubLogin}
            >
              <FaGithub className="text-xl text-[#1877f2]" />
              <span className="text-sm font-medium">Github</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-muted-foreground"
        >
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#6938EF] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RightSection;
