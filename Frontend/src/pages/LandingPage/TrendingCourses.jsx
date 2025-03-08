import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { ChevronLeft, ChevronRight, Star, Users, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";

const CourseCard = ({ course, theme }) => {
  return (
    <div className={cn(
      "flex-none w-[350px] rounded-2xl border overflow-hidden snap-center",
      "transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
      "flex flex-col",
      theme === 'dark' 
        ? 'bg-[#110C1D] border-[#6938EF]/20 hover:border-[#6938EF]/40' 
        : 'bg-card border-border hover:border-[#6938EF]/40'
    )}>
      <div className="relative aspect-video">
        <img
          src={course.courseImg}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className={cn(
          "absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium",
          "bg-[#6938EF] text-white"
        )}>
          {course.badge}
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6">
        <h3 className={cn(
          "text-xl font-semibold mb-2 line-clamp-2",
          theme === 'dark' ? 'text-white' : 'text-foreground'
        )}>
          {course.title}
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-[#6938EF] fill-[#6938EF]" />
            <span className="text-sm text-muted-foreground">
              {course.rating} ({course.reviews})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {course.students} students
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <img
            src={course.instructorImg}
            alt={course.instructor}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-muted-foreground line-clamp-1">
            {course.instructor}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <Button 
            className="w-full bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
};

const TrendingCourses = () => {
  const { theme } = useTheme();
  const courses = [
    {
      id: 1,
      title: 'ML Fundamentals',
      instructor: 'Dr. Sarah Johnson',
      instructorImg: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img-2.png',
      courseImg: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img.png',
      badge: 'Most Popular',
      badgeColor: '#6938EF',
      rating: '4.9',
      reviews: '2.3k',
      students: '15k+'
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      instructor: 'Prof. Michael Chen',
      instructorImg: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img-4.png',
      courseImg: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img-3.png',
      badge: 'Beginner Friendly',
      badgeColor: '#16a34a',
      rating: '4.8',
      reviews: '1.8k',
      students: '12k+'
    },
    {
      id: 3,
      title: 'Cloud Architecture',
      instructor: 'Alex Thompson',
      instructorImg: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img-6.png',
      courseImg: 'https://dashboard.codeparrot.ai/api/image/Z8X9N8hTinWyM7G1/img-5.png',
      badge: 'Advanced',
      badgeColor: '#9333ea',
      rating: '4.7',
      reviews: '1.5k',
      students: '8k+'
    }
  ];

  const containerRef = useRef(null);

  const scrollLeft = () => {
    containerRef.current.scrollBy({
      left: -containerRef.current.clientWidth,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({
      left: containerRef.current.clientWidth,
      behavior: 'smooth'
    });
  };

  return (
    <div className={cn(
      "w-full py-20 px-4 sm:px-6 lg:px-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className={cn(
            "text-4xl sm:text-5xl font-bold mb-6",
            theme === 'dark' ? 'text-white' : 'text-foreground'
          )}>
            Trending Courses
          </h1>
          <p className={cn(
            "text-xl max-w-3xl mx-auto",
            theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'
          )}>
            Explore Top Courses, Master New Skills, and Level Up Your Career
          </p>
        </motion.div>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -left-4 top-1/2 -translate-y-1/2 z-10",
              theme === 'dark' ? 'bg-[#110C1D]/80 hover:bg-[#1A1425]' : 'bg-background/80 hover:bg-accent'
            )}
            onClick={scrollLeft}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -right-4 top-1/2 -translate-y-1/2 z-10",
              theme === 'dark' ? 'bg-[#110C1D]/80 hover:bg-[#1A1425]' : 'bg-background/80 hover:bg-accent'
            )}
            onClick={scrollRight}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[...courses, ...courses].map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CourseCard course={course} theme={theme} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingCourses;

