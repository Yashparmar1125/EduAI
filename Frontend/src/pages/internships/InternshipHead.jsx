import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { Sparkles, Briefcase, Users, Target, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import headerImage from "../../assets/image.png";

const InternshipHead = () => {
  const { theme } = useTheme();

  const stats = [
    { icon: Briefcase, label: "500+", description: "Active Internships" },
    { icon: Users, label: "10k+", description: "Students Placed" },
    { icon: Target, label: "95%", description: "Success Rate" },
  ];

  return (
    <div className="relative pt-12 pb-8 sm:pt-16 lg:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6938EF]/5 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>
      </div>

      {/* Content */}
      <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column - Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start gap-6 sm:gap-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6938EF]/10 text-[#6938EF] backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Transform Your Career Journey</span>
          </div>

          <h1 className={cn(
            "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight",
            theme === 'dark' ? 'text-white' : 'text-foreground'
          )}>
            Discover Your Perfect{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6938EF] to-[#9D7BFF]">
              Internship
            </span>{' '}
            Opportunity
          </h1>

          <p className={cn(
            "text-lg sm:text-xl leading-relaxed max-w-2xl",
            theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'
          )}>
            Launch your career with hands-on experience in top companies. Our AI-powered matching system finds internships that align perfectly with your skills and aspirations.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF] hover:from-[#5B2FD1] hover:to-[#8B6AE5] text-white shadow-lg shadow-[#6938EF]/25"
            >
              Find Internships
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10 backdrop-blur-sm"
            >
              How It Works
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full mt-4 sm:mt-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className={cn(
                  "flex flex-col items-center text-center p-4 rounded-xl backdrop-blur-sm",
                  theme === 'dark' 
                    ? 'bg-white/5 hover:bg-white/10' 
                    : 'bg-[#6938EF]/5 hover:bg-[#6938EF]/10'
                )}
              >
                <stat.icon className="w-6 h-6 mb-3 text-[#6938EF]" />
                <span className={cn(
                  "text-2xl font-bold mb-1",
                  theme === 'dark' ? 'text-white' : 'text-foreground'
                )}>
                  {stat.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.description}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative aspect-square lg:aspect-[4/3] xl:aspect-square max-w-2xl mx-auto lg:max-w-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#6938EF]/20 to-transparent rounded-3xl" />
          <img 
            src={headerImage} 
            alt="Internship Illustration" 
            className="w-full h-full object-contain relative z-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-20" />
        </motion.div>
      </div>
    </div>
  );
};

export default InternshipHead;

