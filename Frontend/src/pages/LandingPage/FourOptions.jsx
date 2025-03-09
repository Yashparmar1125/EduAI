import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Brain, Briefcase, Users, LayoutDashboard } from 'lucide-react';

const FourOptions = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const options = [
    {
      icon: Brain,
      title: "SKILL ASSESSMENT",
      description: "Elevate your potential! Click to assess your skills and discover where you stand.",
      path: "/assessment",
      color: "from-blue-500/20 to-purple-500/20"
    },
    {
      icon: Briefcase,
      title: "INTERNSHIPS",
      description: "Kickstart Your Career! Explore exciting internships and gain real-world experience.",
      path: "/internships",
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: Users,
      title: "COMMUNITY",
      description: "Find Your Tribe! Join a thriving community that matches your passion and interests.",
      path: "/community",
      color: "from-orange-500/20 to-red-500/20"
    },
    {
      icon: LayoutDashboard,
      title: "DASHBOARD",
      description: "Your Learning Hub! Track progress, ongoing lectures, certificates, and more.",
      path: "/dashboard",
      color: "from-purple-500/20 to-pink-500/20"
    }
  ];

  return (
    <div className={cn(
      "w-full py-32",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className={cn(
          "text-3xl sm:text-4xl lg:text-5xl font-bold mb-6",
          theme === 'dark' ? 'text-white' : 'text-foreground'
        )}>
          Your Personalized Path to Success
        </h2>
        <p className={cn(
          "text-xl max-w-3xl mx-auto",
          theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'
        )}>
          Choose your learning journey and unlock new opportunities
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => navigate(option.path)}
            className={cn(
              "group relative rounded-2xl p-8 cursor-pointer min-h-[280px]",
              "transition-all duration-500 hover:shadow-2xl",
              "flex flex-col justify-between overflow-hidden",
              theme === 'dark' 
                ? 'bg-[#110C1D] hover:bg-[#1A1425]' 
                : 'bg-white hover:bg-gray-50'
            )}
          >
            {/* Background Gradient */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500",
              option.color
            )} />

            <div className="relative">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                "transition-all duration-300 group-hover:scale-110",
                theme === 'dark' ? 'bg-[#1A1425]' : 'bg-gray-100'
              )}>
                <option.icon className="w-8 h-8 text-[#6938EF]" />
              </div>
              <h3 className={cn(
                "text-2xl font-bold mb-4 transition-colors duration-300",
                theme === 'dark' ? 'text-white group-hover:text-[#6938EF]' : 'text-foreground group-hover:text-[#6938EF]'
              )}>
                {option.title}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {option.description}
              </p>
            </div>

            <div className={cn(
              "flex items-center gap-2 text-sm font-medium mt-6",
              "transition-colors duration-300",
              theme === 'dark' ? 'text-[#6938EF]' : 'text-primary'
            )}>
              Explore Now
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FourOptions;

