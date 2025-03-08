import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { useDispatch, useSelector } from 'react-redux';
import { 
  BookOpen, 
  Clock, 
  Star, 
  User,
  ChevronRight,
  ArrowLeft,
  Play,
  CheckCircle2,
  Lock,
  BookMarked,
  MessageSquare,
  Share2,
  Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/components/ui/toast';
import { enrollCourse, getCourseDetails } from '../../api/axios.api';

const CourseOverview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await getCourseDetails(courseId);
        setCourse(response.course);
        setIsEnrolled(response.course.isEnrolled || false);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError(error.message || "Failed to fetch course details");
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const response = await enrollCourse(courseId);
      if (response.success) {
        setIsEnrolled(true);
        toast({
          title: "Success",
          description: "Course enrolled successfully",
        });
        // Navigate to the learning page after successful enrollment
        navigate(`/dashboard`);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to enroll in course",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className={cn(
        "min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex items-center justify-center",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6938EF] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex items-center justify-center",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}>
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={cn(
        "min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex items-center justify-center",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}>
        <div className="text-center">
          <p className="text-red-500">Course not found</p>
          <Button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)]",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      {/* Hero Section */}
      <div className="relative h-[300px] w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6938EF]/20 to-[#9D7BFF]/20" />
        <img
          src={course.poster}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              className="mb-6 text-white hover:text-white hover:bg-white/10"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{course.instructor?.name || 'Unknown Instructor'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{course.duration || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="text-sm">{course.rating || '4.5'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{course.studentsEnrolled?.length || 0} students</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Course Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          {isEnrolled ? (
            <div className="flex items-center gap-4">
              <div className={cn(
                "px-4 py-2 rounded-lg flex items-center gap-2",
                theme === 'dark' ? 'bg-[#6938EF]/20' : 'bg-[#6938EF]/10'
              )}>
                <CheckCircle2 className="h-4 w-4 text-[#6938EF]" />
                <span className="text-sm font-medium text-[#6938EF]">Enrolled</span>
              </div>
              <Button
                className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
                onClick={() => navigate(`/learning/${courseId}`)}
              >
                <Play className="h-4 w-4 mr-2" />
                Continue Learning
              </Button>
            </div>
          ) : (
            <Button
              className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
              onClick={handleEnroll}
            >
              Enroll Now
            </Button>
          )}
          <Button variant="outline" className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10">
            <BookMarked className="h-4 w-4 mr-2" />
            Save for Later
          </Button>
          <Button variant="outline" className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn(
                "p-6 rounded-xl border shadow-sm",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Course Description</h2>
                {isEnrolled && (
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    theme === 'dark' ? 'bg-[#6938EF]/20 text-[#6938EF]' : 'bg-[#6938EF]/10 text-[#6938EF]'
                  )}>
                    Enrolled
                  </div>
                )}
              </div>
              <p className="text-muted-foreground">{course.description}</p>
            </motion.div>

            {/* Course Modules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn(
                "p-6 rounded-xl border shadow-sm",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">Course Content</h2>
                  {isEnrolled && (
                    <div className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      theme === 'dark' ? 'bg-[#6938EF]/20 text-[#6938EF]' : 'bg-[#6938EF]/10 text-[#6938EF]'
                    )}>
                      Enrolled
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{course.modules?.length || 0} modules</span>
                  <span>•</span>
                  <span>{course.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0} lessons</span>
                </div>
              </div>
              <div className="space-y-4">
                {course.modules?.map((module, moduleIndex) => (
                  <div key={module._id} className={cn(
                    "p-4 rounded-lg border",
                    theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/10' : 'bg-accent/50 border-border'
                  )}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium",
                          theme === 'dark' ? 'bg-[#6938EF]/20 text-[#6938EF]' : 'bg-[#6938EF]/10 text-[#6938EF]'
                        )}>
                          {moduleIndex + 1}
                        </div>
                        <h3 className="font-medium">{module.title}</h3>
                      </div>
                      <span className="text-sm text-muted-foreground">{module.duration}</span>
                    </div>
                    <div className="space-y-2">
                      {module.lessons?.map((lesson) => (
                        <div key={lesson._id} className={cn(
                          "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all",
                          theme === 'dark' 
                            ? 'hover:bg-[#1A1425]/50' 
                            : 'hover:bg-accent'
                        )}>
                          {isEnrolled ? (
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center",
                              theme === 'dark' ? 'bg-[#6938EF]/20' : 'bg-[#6938EF]/10'
                            )}>
                              <Play className="h-4 w-4 text-[#6938EF]" />
                            </div>
                          ) : (
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center",
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                            )}>
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{lesson.title}</span>
                              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {(!course.modules || course.modules.length === 0) && (
                  <div className="text-center text-muted-foreground py-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No course content available yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Course Progress */}
            {isEnrolled && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={cn(
                  "p-6 rounded-xl border shadow-sm",
                  theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
                )}
              >
                <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Overall Progress</span>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                    <Progress value={0} className="h-2" 
                      indicatorClassName="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF]" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Completed Lessons</span>
                      <span className="text-sm font-medium">0/0</span>
                    </div>
                    <Progress value={0} className="h-2" 
                      indicatorClassName="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF]" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Course Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={cn(
                "p-6 rounded-xl border shadow-sm",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}
            >
              <h2 className="text-xl font-semibold mb-4">Course Features</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    theme === 'dark' ? 'bg-[#6938EF]/20' : 'bg-[#6938EF]/10'
                  )}>
                    <CheckCircle2 className="h-5 w-5 text-[#6938EF]" />
                  </div>
                  <span className="text-sm">Full lifetime access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    theme === 'dark' ? 'bg-[#6938EF]/20' : 'bg-[#6938EF]/10'
                  )}>
                    <CheckCircle2 className="h-5 w-5 text-[#6938EF]" />
                  </div>
                  <span className="text-sm">Access on mobile and desktop</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    theme === 'dark' ? 'bg-[#6938EF]/20' : 'bg-[#6938EF]/10'
                  )}>
                    <CheckCircle2 className="h-5 w-5 text-[#6938EF]" />
                  </div>
                  <span className="text-sm">Certificate of completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    theme === 'dark' ? 'bg-[#6938EF]/20' : 'bg-[#6938EF]/10'
                  )}>
                    <CheckCircle2 className="h-5 w-5 text-[#6938EF]" />
                  </div>
                  <span className="text-sm">30-day money-back guarantee</span>
                </div>
              </div>
            </motion.div>

            {/* Course Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={cn(
                "p-6 rounded-xl border shadow-sm",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}
            >
              <h2 className="text-xl font-semibold mb-4">Course Resources</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10">
                  <Download className="h-4 w-4 mr-2" />
                  Course Materials
                </Button>
                <Button variant="outline" className="w-full justify-start border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Course Discussion
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;