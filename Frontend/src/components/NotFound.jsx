import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Home, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "../components/theme-provider";

const NotFound = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex items-center justify-center",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="w-full max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Image/Illustration */}
          <div className="mb-8 relative">
            <div className={cn(
              "w-48 h-48 mx-auto rounded-full",
              theme === 'dark' 
                ? 'bg-[#1A1425] border-2 border-[#6938EF]/20' 
                : 'bg-purple-50 border-2 border-[#6938EF]/10'
            )}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn(
                  "text-7xl font-bold",
                  theme === 'dark' 
                    ? 'text-[#6938EF]' 
                    : 'text-[#6938EF]'
                )}>
                  404
                </span>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-[#6938EF]/10 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-[#6938EF]/20 animate-pulse delay-75" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className={cn(
            "text-3xl sm:text-4xl font-bold mb-4",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            Oops! Page Not Found
          </h1>
          
          <p className={cn(
            "text-lg mb-8 max-w-md mx-auto",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            Looks like you've ventured into uncharted territory. Let's get you back on your learning path!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/')}
              className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white min-w-[160px] flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
            
            <Button
              onClick={() => navigate('/explore')}
              variant="outline"
              className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10 min-w-[160px] flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Explore Courses
            </Button>
          </div>

          {/* Search Suggestion */}
          <div className={cn(
            "mt-12 p-6 rounded-xl border",
            theme === 'dark' 
              ? 'bg-[#110C1D] border-[#6938EF]/20' 
              : 'bg-white border-purple-100'
          )}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Search className="h-5 w-5 text-[#6938EF]" />
              <span className={cn(
                "text-sm font-medium",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                Popular Learning Paths
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {['Web Development', 'Data Science', 'AI & ML', 'Cloud Computing'].map((path) => (
                <Button
                  key={path}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-[#6938EF] hover:bg-[#6938EF]/10"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(path)}`)}
                >
                  {path}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;