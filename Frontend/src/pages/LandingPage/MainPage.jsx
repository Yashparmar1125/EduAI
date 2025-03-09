import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import TopSection from './TopSection';
import FourOptions from './FourOptions';
import TrendingCourses from './TrendingCourses';
import Testimonials from './Testimonials';

const MainPage = () => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "w-full min-h-screen overflow-x-hidden",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}
    >
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/5 pointer-events-none" />
        <TopSection />
      </section>

      {/* Features Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/5 to-transparent pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <FourOptions />
        </div>
      </section>

      {/* Trending Courses Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/5 pointer-events-none" />
        <div className="max-w-[1400px] mx-auto">
          <TrendingCourses />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/5 to-transparent pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Testimonials />
        </div>
      </section>

      {/* Footer Gradient */}
      <div className="h-32 bg-gradient-to-b from-transparent to-background/10" />
    </motion.div>
  );
};

export default MainPage;