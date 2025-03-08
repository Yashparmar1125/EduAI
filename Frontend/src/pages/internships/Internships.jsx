import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import InternshipHead from './InternshipHead';
import InternshipBody from './InternshipBody';
import InternshipFAQ from './InternshipFAQ';

const Internships = () => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "w-full min-h-screen relative pb-20",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}
    >
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6938EF]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-[#9D7BFF]/10 rounded-full blur-[100px]" />
        {theme === 'dark' && (
          <div className="absolute inset-0 bg-[#0A0118]/60 backdrop-blur-[1px]" />
        )}
      </div>

      {/* Content */}
      <div className="relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20 lg:space-y-32">
          <InternshipHead />
          <InternshipBody />
          <InternshipFAQ />
        </div>
      </div>
    </motion.div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '1440px',
    margin: '0 auto',
    backgroundColor: '#3a0ca3',
    // padding: '20px',
    boxSizing: 'border-box',
  },
  cardSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '64px',
  },
  cardRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: '36px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default Internships;

