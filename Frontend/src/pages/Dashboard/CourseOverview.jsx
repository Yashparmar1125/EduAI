import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { 
  BookOpen, 
  Clock, 
  Star, 
  User,
  CheckCircle,
  PlayCircle,
  FileText,
  Download,
  MessageSquare
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const CourseOverview = () => {
  const { theme } = useTheme();
  
  // Mock course data
  const course = {
    title: "Digital Marketing with AI",
    description: "Master the art of digital marketing with AI tools and automation",
    instructor: {
      name: "Dr. Sarah Mitchell",
      avatar: "/assets/instructor.png",
      title: "Digital Marketing Expert",
      students: 15420,
      courses: 12,
      rating: 4.8
    },
    stats: {
      enrolled: 1245,
      duration: "15 hours",
      modules: 8,
      level: "Intermediate"
    },
    progress: 0,
    features: [
      "Access to AI marketing tools",
      "Real-world case studies",
      "Lifetime access",
      "Certificate of completion"
    ],
    modules: [
      {
        id: 1,
        title: "Introduction to Digital Marketing",
        duration: "45 mins",
        lectures: 5,
        isLocked: false,
        isCompleted: false
      },
      {
        id: 2,
        title: "Understanding Your Target Audience",
        duration: "1 hour",
        lectures: 4,
        isLocked: false,
        isCompleted: false
      },
      {
        id: 3,
        title: "AI Tools for Market Research",
        duration: "2 hours",
        lectures: 6,
        isLocked: true,
        isCompleted: false
      }
    ],
    reviews: [
      {
        id: 1,
        user: {
          name: "Alex Thompson",
          avatar: "/assets/user1.png"
        },
        rating: 5,
        comment: "This course exceeded my expectations. The AI tools section was particularly helpful.",
        date: "2 days ago"
      },
      {
        id: 2,
        user: {
          name: "Maria Garcia",
          avatar: "/assets/user2.png"
        },
        rating: 4,
        comment: "Great content and practical examples. Would recommend to beginners.",
        date: "1 week ago"
      }
    ]
  };

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)] p-4 sm:p-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "p-6 sm:p-8 rounded-2xl shadow-lg border mb-8",
            theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
          )}
        >
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="space-y-4">
              <h1 className={cn(
                "text-2xl sm:text-3xl font-bold",
                theme === 'dark' ? 'text-white' : 'text-foreground'
              )}>
                {course.title}
              </h1>
              <p className="text-muted-foreground">{course.description}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{course.instructor.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{course.stats.enrolled} students</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{course.stats.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={course.instructor.avatar} />
                  <AvatarFallback className="bg-[#6938EF]/10 text-[#6938EF]">
                    {course.instructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{course.instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white">
                Continue Learning
              </Button>
              <Progress value={course.progress} className="h-2" 
                indicatorClassName="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF]" />
              <p className="text-xs text-center text-muted-foreground">
                {course.progress}% Complete
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Modules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={cn(
                "rounded-xl border shadow-sm",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}>
                <div className="p-5 border-b border-border">
                  <h2 className={cn(
                    "text-lg font-semibold",
                    theme === 'dark' ? 'text-white' : 'text-foreground'
                  )}>
                    Course Content
                  </h2>
                </div>
                <div className="divide-y divide-border">
                  {course.modules.map((module) => (
                    <div key={module.id} className={cn(
                      "flex items-center gap-4 p-5 transition-all",
                      theme === 'dark' ? 'hover:bg-[#1A1425]/50' : 'hover:bg-accent',
                      module.isLocked && 'opacity-50'
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        module.isCompleted ? "bg-green-500/20 text-green-500" : "bg-[#6938EF]/20 text-[#6938EF]"
                      )}>
                        {module.isCompleted ? <CheckCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{module.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {module.duration}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {module.lectures} lectures
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className={cn(
                "rounded-xl border shadow-sm",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}>
                <div className="p-5 border-b border-border">
                  <h2 className={cn(
                    "text-lg font-semibold",
                    theme === 'dark' ? 'text-white' : 'text-foreground'
                  )}>
                    Student Reviews
                  </h2>
                </div>
                <div className="p-5 space-y-4">
                  {course.reviews.map((review) => (
                    <div key={review.id} className={cn(
                      "p-4 rounded-xl",
                      theme === 'dark' ? 'bg-[#1A1425]/50' : 'bg-accent/50'
                    )}>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.user.avatar} />
                          <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium">{review.user.name}</h3>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            ))}
                          </div>
                          <p className="text-sm mt-2">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Course Info */}
          <div className="space-y-6">
            {/* Course Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className={cn(
                "rounded-xl border shadow-sm",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}>
                <div className="p-5 border-b border-border">
                  <h2 className={cn(
                    "text-lg font-semibold",
                    theme === 'dark' ? 'text-white' : 'text-foreground'
                  )}>
                    Course Features
                  </h2>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-[#6938EF]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Course Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className={cn(
                "rounded-xl border shadow-sm",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}>
                <div className="p-5 border-b border-border">
                  <h2 className={cn(
                    "text-lg font-semibold",
                    theme === 'dark' ? 'text-white' : 'text-foreground'
                  )}>
                    Course Resources
                  </h2>
                </div>
                <div className="p-5">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2 border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
                  >
                    <Download className="h-4 w-4" />
                    Download Materials
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;