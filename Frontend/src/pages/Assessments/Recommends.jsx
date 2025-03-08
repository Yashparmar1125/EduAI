import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Recommends = () => {
  const { theme } = useTheme();

  const courses = [
    {
      id: 1,
      title: "UI Design Fundamentals",
      description: "Master the core concepts of interface design with UI fundamentals",
      image: "",
      rating: 4.7,
      duration: "2h 45m",
      level: "Beginner"
    },
    {
      id: 2,
      title: "Figma Masterclass",
      description: "Learn UI design professional from zero using Figma",
      image: "/path/to/figma-image.png",
      rating: 4.8,
      duration: "3h 30m",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Advanced UX Research",
      description: "Learn advanced user research methods and analysis",
      image: "/path/to/ux-research-image.png",
      rating: 4.9,
      duration: "4h 15m",
      level: "Advanced"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h2 align="center" className={cn(
        "text-lg font-semibold py-8 mb-4",
        theme === 'dark' ? 'text-white' : 'text-foreground'
      )}>
        Recommended Courses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Link to="/course" key={course.id}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={cn(
                "rounded-xl border overflow-hidden",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className={cn(
                  "absolute top-2 right-2 px-2 py-1 rounded-full text-xs",
                  theme === 'dark' ? 'bg-[#110C1D]/90' : 'bg-white/90'
                )}>
                  {course.level}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-[#6938EF] text-[#6938EF]" />
                    <span className="text-sm ml-1">{course.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{course.duration}</span>
                </div>

                <h3 className={cn(
                  "font-semibold mb-1",
                  theme === 'dark' ? 'text-white' : 'text-foreground'
                )}>
                  {course.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {course.description}
                </p>

                <Button 
                  className="w-full bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
                >
                  Start Learning
                </Button>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default Recommends;