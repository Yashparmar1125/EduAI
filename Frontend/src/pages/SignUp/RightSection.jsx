import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle,  FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { Mail, Lock, User, Briefcase, Heart } from 'lucide-react';

const RightSection = ({ defaultData = {}, onGoggleSignUp, onSignUp, onGithubSignUp }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: defaultData.firstName || '',
    lastName: defaultData.lastName || '',
    email: defaultData.email || '',
    password: defaultData.password || '',
    interests: defaultData.interests || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.interests) newErrors.interests = 'Interests are required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await onSignUp(formData);
      } catch (error) {
        console.error('Signup error:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'Failed to create account'
        }));
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Validation errors:', newErrors);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[480px] flex justify-center items-center"
    >
      <div className={cn(
        "bg-card rounded-2xl p-8 sm:p-12 w-full shadow-lg border",
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
          Create Account
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-base text-center mb-8 text-muted-foreground"
        >
          Join our learning community today
        </motion.p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-xl bg-background border-2 transition-all duration-200",
                      "focus:outline-none focus:border-[#6938EF] focus:ring-2 focus:ring-[#6938EF]/20",
                      errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input",
                      theme === 'dark' ? 'bg-[#1A1425] text-white' : 'bg-white text-foreground'
                    )}
                  />
                </div>
                {errors.firstName && (
                  <span className="text-sm text-red-500">{errors.firstName}</span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-xl bg-background border-2 transition-all duration-200",
                      "focus:outline-none focus:border-[#6938EF] focus:ring-2 focus:ring-[#6938EF]/20",
                      errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input",
                      theme === 'dark' ? 'bg-[#1A1425] text-white' : 'bg-white text-foreground'
                    )}
                  />
                </div>
                {errors.lastName && (
                  <span className="text-sm text-red-500">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl bg-background border-2 transition-all duration-200",
                    "focus:outline-none focus:border-[#6938EF] focus:ring-2 focus:ring-[#6938EF]/20",
                    errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input",
                    theme === 'dark' ? 'bg-[#1A1425] text-white' : 'bg-white text-foreground'
                  )}
                />
              </div>
              {errors.email && (
                <span className="text-sm text-red-500">{errors.email}</span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl bg-background border-2 transition-all duration-200",
                    "focus:outline-none focus:border-[#6938EF] focus:ring-2 focus:ring-[#6938EF]/20",
                    errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input",
                    theme === 'dark' ? 'bg-[#1A1425] text-white' : 'bg-white text-foreground'
                  )}
                />
              </div>
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password}</span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="interests" className="text-sm font-medium text-foreground">Interests</label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="interests"
                  type="text"
                  name="interests"
                  placeholder="What interests you?"
                  value={formData.interests}
                  onChange={handleChange}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl bg-background border-2 transition-all duration-200",
                    "focus:outline-none focus:border-[#6938EF] focus:ring-2 focus:ring-[#6938EF]/20",
                    errors.interests ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-input",
                    theme === 'dark' ? 'bg-[#1A1425] text-white' : 'bg-white text-foreground'
                  )}
                />
              </div>
              {errors.interests && (
                <span className="text-sm text-red-500">{errors.interests}</span>
              )}
            </div>

            {errors.submit && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-500">{errors.submit}</p>
              </div>
            )}

            <button 
              type="submit" 
              className={cn(
                "relative w-full py-3 px-4 rounded-xl font-semibold text-white",
                "bg-[#6938EF] hover:bg-[#5B2FD1] active:bg-[#4B24B3]",
                "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/20",
                "disabled:opacity-70 disabled:cursor-not-allowed",
                "transition-colors duration-200 ease-in-out z-10",
                loading ? "flex items-center justify-center" : ""
              )}
              disabled={loading}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Create Account'
              )}
            </button>
          </motion.div>
        </form>

        <div className="mt-8 text-center">
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 border-t border-border"></div>
            <span className="relative px-4 text-sm text-muted-foreground bg-card">
              Or sign up with
            </span>
          </div>
          <div className="flex justify-center gap-4">
            <button 
              type="button"
              className={cn(
                "relative flex items-center gap-2 px-6 py-3 rounded-xl border",
                "hover:bg-accent hover:border-[#6938EF]/40",
                "active:bg-accent/70",
                "transition-all duration-200 ease-in-out z-10",
                theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
              )}
              onClick={onGoggleSignUp}
              aria-label="Sign up with Google"
            >
              <FaGoogle className="text-xl text-[#ea4335]" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button 
              type="button"
              className={cn(
                "relative flex items-center gap-2 px-6 py-3 rounded-xl border",
                "hover:bg-accent hover:border-[#6938EF]/40",
                "active:bg-accent/70",
                "transition-all duration-200 ease-in-out z-10",
                theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
              )}
              aria-label="Sign up with Facebook"
              onClick={onGithubSignUp}
            >
              <FaGithub className="text-xl text-[#1877f2]" />
              <span className="text-sm font-medium">Github</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-muted-foreground">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-[#6938EF] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RightSection;
