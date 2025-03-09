import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { ArrowRight, Sparkles, Users, BookOpen, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import heroImg from '../../assets/heroImg.png';

import FourOptions from './FourOptions'; // Import FourOptions component
import TrendingCourses from './TrendingCourses'; // Import TrendingCourses component
import Testimonials from './Testimonials'; // Import Testimonials component

const TopSection = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const stats = [
    { icon: Users, label: "Active Learners", value: "50K+" },
    { icon: BookOpen, label: "Total Courses", value: "200+" },
    { icon: Star, label: "5-Star Reviews", value: "10K+" },
  ];

  return (
    <div className={cn(
      "relative w-full min-h-screen flex flex-col justify-center overflow-hidden",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-[#6938EF]/5" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] rounded-full bg-[#6938EF]/5" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start gap-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6938EF]/10 text-[#6938EF]">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">The Future of Learning is Here</span>
            </div>

            <h1 className={cn(
              "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight",
              theme === 'dark' ? 'text-white' : 'text-foreground'
            )}>
              Unlock Your <span className="text-[#6938EF]">Potential</span> with Personalized Learning
            </h1>

            <p className={cn(
              "text-xl sm:text-2xl leading-relaxed max-w-2xl",
              theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'
            )}>
              Join our community of learners and embark on a journey towards mastery with AI-powered personalized learning paths.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white font-semibold px-8 py-6 text-lg rounded-xl flex items-center gap-2"
                onClick={() => navigate('/signup')}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#6938EF] text-[#6938EF] hover:bg-[#6938EF]/10 font-semibold px-8 py-6 text-lg rounded-xl"
                onClick={() => navigate('/explore')}
              >
                Explore Courses
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-8 w-full">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                    theme === 'dark' ? 'bg-[#1A1425]' : 'bg-accent/50'
                  )}>
                    <stat.icon className="w-6 h-6 text-[#6938EF]" />
                  </div>
                  <div className={cn(
                    "text-2xl font-bold mb-1",
                    theme === 'dark' ? 'text-white' : 'text-foreground'
                  )}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6938EF]/20 to-transparent rounded-3xl transform rotate-3" />
            <div className="absolute inset-0 bg-gradient-to-bl from-[#6938EF]/20 to-transparent rounded-3xl transform -rotate-3" />
            <img
              src={heroImg}
              alt="Hero"
              className="relative w-full h-auto object-cover rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TopSection;
