import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { 
  Play,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Menu,
  X,
  ChevronDown,
  Clock,
  CheckCircle,
  Lock,
  Award,
  Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/components/ui/toast';
import { 
  getCourseDetails, 
  startModule, 
  updateModuleProgress, 
  completeModule,
  getCourseProgress,
  getCourseCompletionStatus,
  getCertificate
} from '../../api/axios.api';

const CourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const playerRef = useRef(null);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [progress, setProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const progressUpdateInterval = useRef(null);
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [certificate, setCertificate] = useState(null);

  // Get current module data
  const currentModuleData = course?.modules?.[currentModule];
  // Since we don't have lessons array anymore, we'll use the module itself as the lesson
  const currentLessonData = currentModuleData;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const [courseResponse, progressResponse, completionResponse] = await Promise.all([
          getCourseDetails(courseId),
          getCourseProgress(courseId),
          getCourseCompletionStatus(courseId)
        ]);
        
        if (!courseResponse?.course) {
          throw new Error("Course not found");
        }
        
        setCourse(courseResponse.course);
        
        // Set progress and completed modules
        if (progressResponse) {
          // Calculate overall progress based on completed modules
          const totalModules = courseResponse.course.modules.length;
          const completedModulesCount = progressResponse.completedModules.length;
          const calculatedProgress = (completedModulesCount / totalModules) * 100;
          
          setProgress(calculatedProgress);
          setCompletedModules(progressResponse.completedModules || []);
          setIsCourseCompleted(completionResponse.isCompleted);
          
          // Fetch certificate if course is completed
          if (completionResponse.isCompleted) {
            const certificateResponse = await getCertificate(courseId);
            setCertificate(certificateResponse.certificate);
          }
          
          // Find the first incomplete module
          const incompleteModuleIndex = courseResponse.course.modules.findIndex(
            module => !progressResponse.completedModules.includes(module._id)
          );
          
          if (incompleteModuleIndex !== -1) {
            setCurrentModule(incompleteModuleIndex);
          } else {
            // If all modules are completed, set to the last module
            setCurrentModule(courseResponse.course.modules.length - 1);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError(error.response?.data?.error || error.message || "Failed to fetch course details");
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!currentLessonData?.videoUrl) return;

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: getYouTubeVideoId(currentLessonData.videoUrl),
        playerVars: {
          'autoplay': 0,
          'controls': 1,
          'rel': 0,
          'showinfo': 0,
          'modestbranding': 1,
        },
        events: {
          'onStateChange': onPlayerStateChange,
        }
      });
    };

    return () => {
      window.onYouTubeIframeAPIReady = null;
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [currentLessonData?.videoUrl]);

  const getYouTubeVideoId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const onPlayerStateChange = async (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      await handleVideoEnd();
    } else if (event.data === window.YT.PlayerState.PLAYING) {
      setIsVideoPlaying(true);
      startProgressTracking();
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsVideoPlaying(false);
      stopProgressTracking();
    }
  };

  const startProgressTracking = () => {
    if (progressUpdateInterval.current) {
      clearInterval(progressUpdateInterval.current);
    }

    progressUpdateInterval.current = setInterval(async () => {
      if (playerRef.current && isVideoPlaying) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        const progress = (currentTime / duration) * 100;
        setVideoProgress(progress);

        // Update progress in backend after every 20%
        if (progress - lastProgressUpdate >= 20) {
          try {
            const currentModuleId = currentModuleData._id;
            
            // Start module if not already started
            if (!completedModules.includes(currentModuleId)) {
              await startModule(courseId, currentModuleId);
            }

            // Update module progress
            await updateModuleProgress(courseId, currentModuleId, progress);
            setLastProgressUpdate(progress);

            // Show progress update toast
            toast({
              title: "Progress Updated",
              description: `You've completed ${Math.round(progress)}% of this module`,
              className: "bg-[#6938EF] text-white",
            });
          } catch (error) {
            console.error("Error updating progress:", error);
          }
        }

        // Mark module as completed when video is 80% watched
        if (progress >= 80 && !completedModules.includes(currentModuleData._id)) {
          handleModuleCompletion();
        }
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressUpdateInterval.current) {
      clearInterval(progressUpdateInterval.current);
      progressUpdateInterval.current = null;
    }
  };

  const handleModuleCompletion = async () => {
    if (!course || !currentModuleData) return;
    
    try {
      const currentModuleId = currentModuleData._id;
      
      // Start module if not already started
      if (!completedModules.includes(currentModuleId)) {
        await startModule(courseId, currentModuleId);
      }

      // Update module progress
      await updateModuleProgress(courseId, currentModuleId, 100);

      // Complete the module
      await completeModule(courseId, currentModuleId);
      
      // Update local state
      const newCompletedModules = [...completedModules, currentModuleId];
      setCompletedModules(newCompletedModules);

      // Calculate and update overall progress
      const totalModules = course.modules.length;
      const completedModulesCount = newCompletedModules.length;
      const newProgress = (completedModulesCount / totalModules) * 100;
      setProgress(newProgress);
      
      // Set course completion status
      setIsCourseCompleted(newProgress === 100);

      // Show completion toast
      toast({
        title: "Module Completed!",
        description: "Great job! You've completed this module.",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  const handleVideoEnd = async () => {
    if (!course || !currentModuleData) return;
    
    try {
      const currentModuleId = currentModuleData._id;
      
      // Start module if not already started
      if (!completedModules.includes(currentModuleId)) {
        await startModule(courseId, currentModuleId);
      }

      // Update module progress
      await updateModuleProgress(courseId, currentModuleId, 100);

      // Complete the module
      await completeModule(courseId, currentModuleId);
      
      // Update local state
      const newCompletedModules = [...completedModules, currentModuleId];
      setCompletedModules(newCompletedModules);

      // Calculate and update overall progress
      const totalModules = course.modules.length;
      const completedModulesCount = newCompletedModules.length;
      const newProgress = (completedModulesCount / totalModules) * 100;
      setProgress(newProgress);
      
      // Set course completion status
      setIsCourseCompleted(newProgress === 100);
      
      // Move to next module if available
      if (currentModule < course.modules.length - 1) {
        setCurrentModule(currentModule + 1);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  const handleNextLesson = () => {
    if (!course || !currentModuleData) return;
    
    if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (!course || !currentModuleData) return;
    
    if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
    };
  }, []);

  if (isLoading) {
    return (
      <div className={cn(
        "min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex items-center justify-center",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6938EF] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading course content...</p>
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

  if (!course || !currentModuleData || !currentLessonData) {
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

  // Render completion state if course is completed
  if (isCourseCompleted) {
    return (
      <div className={cn(
        "min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex items-center justify-center",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}>
        <div className={cn(
          "max-w-2xl w-full p-8 rounded-xl border text-center",
          theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
        )}>
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Congratulations! 🎉</h1>
          <p className="text-xl text-muted-foreground mb-8">
            You've successfully completed {course.title}
          </p>
          {certificate && (
            <div className="mb-8">
              <div className="bg-[#6938EF]/10 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Your Digital Certificate</h3>
                <p className="text-sm text-muted-foreground">Certificate ID: {certificate.certificateId}</p>
                <p className="text-sm text-muted-foreground">Issued on: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">Valid until: {new Date(certificate.expiryDate).toLocaleDateString()}</p>
              </div>
              <Button 
                className="w-full bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
                onClick={() => window.open(`/verify-certificate/${certificate.certificateId}`, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                View Certificate
              </Button>
            </div>
          )}
          <div className="space-y-4">
            <Button 
              className="w-full bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
              onClick={() => navigate('/explore')}
            >
              Explore More Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)]",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      {/* Header */}
      <div className={cn(
        "border-b sticky top-0 z-10",
        theme === 'dark' ? 'border-[#6938EF]/20 bg-[#0A0118]/80 backdrop-blur-sm' : 'border-border bg-background/80 backdrop-blur-sm'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSidebar(!showSidebar)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{course.title}</h1>
                <p className="text-sm text-muted-foreground">{course.category} • {course.level}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Module {currentModule + 1} of {course.modules.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32">
                  <Progress value={progress} className="h-2" 
                    indicatorClassName="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF]" />
                </div>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </div>
            </div>
            
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Main Content */}
        <div className={cn(
          "flex-1 p-4 sm:p-8 overflow-y-auto",
          showSidebar ? 'lg:w-[calc(100%-320px)]' : 'w-full'
        )}>
          {/* YouTube Player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 shadow-lg relative">
            <div id="youtube-player" className="w-full h-full"></div>
            {/* Video Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <div 
                className="h-full bg-[#6938EF] transition-all duration-1000"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>

          {/* Lesson Content */}
          <div className="space-y-8">
          <div className={cn(
              "p-6 rounded-xl border",
            theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
          )}>
              <div className="flex items-center gap-2 mb-4">
                <div className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  theme === 'dark' ? 'bg-[#6938EF]/20 text-[#6938EF]' : 'bg-[#6938EF]/10 text-[#6938EF]'
                )}>
                  Module {currentModule + 1}
                </div>
                {completedModules.includes(currentModuleData._id) && (
                  <div className="flex items-center gap-1 text-green-500 text-xs">
                    <CheckCircle className="h-3 w-3" />
                    <span>Completed</span>
                  </div>
                )}
                {!completedModules.includes(currentModuleData._id) && (
                  <div className="flex items-center gap-1 text-[#6938EF] text-xs">
                    <Play className="h-3 w-3" />
                    <span>{Math.round(videoProgress)}% watched</span>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-semibold mb-3">{currentModuleData.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{currentModuleData.content}</p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePreviousLesson}
                disabled={currentModule === 0}
                className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Module
              </Button>
              <Button
                onClick={handleNextLesson}
                disabled={currentModule === course.modules.length - 1}
                className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
              >
                Next Module
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={cn(
          "w-80 border-l overflow-y-auto sticky top-[8rem]",
          theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border',
          !showSidebar && 'hidden'
        )}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Course Content</h2>
              <div className="text-sm text-muted-foreground">
                {completedModules.length} of {course.modules.length} completed
              </div>
            </div>
            <div className="space-y-2">
              {course.modules.map((module, moduleIndex) => (
                <div
                  key={moduleIndex}
              className={cn(
                    "group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                    currentModule === moduleIndex
                      ? 'bg-[#6938EF]/10 text-[#6938EF]'
                      : 'hover:bg-accent'
                  )}
                  onClick={() => setCurrentModule(moduleIndex)}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    currentModule === moduleIndex
                      ? 'bg-[#6938EF] text-white'
                      : completedModules.includes(module._id)
                      ? 'bg-green-500 text-white'
                      : 'bg-accent text-muted-foreground'
                  )}>
                    {completedModules.includes(module._id) ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{module.title}</span>
                      {completedModules.includes(module._id) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {module.content.substring(0, 50)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
              </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;