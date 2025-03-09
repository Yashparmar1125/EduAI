import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Download,
  FileText,
  Video,
  AlertCircle,
  Timer,
  BookOpenCheck,
  GraduationCap,
  Share2,
  Copy,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/components/ui/toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  getCourseDetails, 
  startModule, 
  updateModuleProgress, 
  completeModule,
  getCourseProgress,
  getCourseCompletionStatus,
  getCertificate,
 
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
  const [isProgressUpdating, setIsProgressUpdating] = useState(false);

  // Get current module data
  const currentModuleData = course?.modules?.[currentModule];
  // Since we don't have lessons array anymore, we'll use the module itself as the lesson
  const currentLessonData = currentModuleData;

  const safeLocalStorage = {
    get: (key) => {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('Storage access denied:', error);
        return null;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        console.warn('Storage access denied:', error);
        return false;
      }
    }
  };

  const handleShare = async (platform) => {
    try {
      const shareUrl = window.location.href;
      const shareText = `Learning ${course.title}`;

      switch (platform) {
        case 'copy':
          try {
            await navigator.clipboard.writeText(shareUrl);
            toast({
              title: "Link Copied!",
              description: "Course link has been copied to clipboard",
              className: "bg-green-500 text-white",
            });
          } catch (err) {
            // Fallback for clipboard API failure
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            try {
              document.execCommand('copy');
              toast({
                title: "Link Copied!",
                description: "Course link has been copied to clipboard",
                className: "bg-green-500 text-white",
              });
            } catch (err) {
              toast({
                title: "Copy Failed",
                description: "Please copy the URL from your browser's address bar",
                variant: "destructive",
              });
            }
            document.body.removeChild(textArea);
          }
          break;
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'noopener,noreferrer'
          );
          break;
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'noopener,noreferrer'
          );
          break;
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Share Failed",
        description: "Unable to share the course at this time",
        variant: "destructive",
      });
    }
  };

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
          const calculatedProgress = Math.min((completedModulesCount / totalModules) * 100, 100);
          
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
          'onError': onPlayerError,
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

  const onPlayerError = (event) => {
    console.error("YouTube Player Error:", event);
    toast({
      title: "Video Error",
      description: "There was an error playing the video. Please try again.",
      variant: "destructive",
    });
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
      await updateCurrentProgress();
    }
  };

  const updateCurrentProgress = async () => {
    if (!playerRef.current || isProgressUpdating) return;

    try {
      setIsProgressUpdating(true);
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      const currentProgress = (currentTime / duration) * 100;

      if (currentProgress > lastProgressUpdate) {
        const currentModuleId = currentModuleData._id;
        await updateModuleProgress(courseId, currentModuleId, currentProgress);
        setLastProgressUpdate(currentProgress);
        setVideoProgress(currentProgress);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsProgressUpdating(false);
    }
  };

  const startProgressTracking = () => {
    if (progressUpdateInterval.current) {
      clearInterval(progressUpdateInterval.current);
    }

    progressUpdateInterval.current = setInterval(async () => {
      if (playerRef.current && isVideoPlaying && !isProgressUpdating) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        const progress = (currentTime / duration) * 100;
        setVideoProgress(progress);

        if (progress - lastProgressUpdate >= 10) {
          try {
            const currentModuleId = currentModuleData._id;
            
            if (!completedModules.includes(currentModuleId)) {
              await startModule(courseId, currentModuleId);
            }

            await updateModuleProgress(courseId, currentModuleId, progress);
            setLastProgressUpdate(progress);

            if (progress >= 90 && !completedModules.includes(currentModuleId)) {
              await handleModuleCompletion();
            }
          } catch (error) {
            console.error("Error updating progress:", error);
          }
        }
      }
    }, 2000);
  };

  const stopProgressTracking = () => {
    if (progressUpdateInterval.current) {
      clearInterval(progressUpdateInterval.current);
      progressUpdateInterval.current = null;
    }
  };

  const handleModuleCompletion = async () => {
    if (!course || !currentModuleData || completedModules.includes(currentModuleData._id)) return;
    
    try {
        const currentModuleId = currentModuleData._id;
        await completeModule(courseId, currentModuleId);
        
        const newCompletedModules = [...completedModules, currentModuleId];
        setCompletedModules(newCompletedModules);

        const totalModules = course.modules.length;
        const completedModulesCount = newCompletedModules.length;
        const newProgress = Math.min((completedModulesCount / totalModules) * 100, 100);
        setProgress(newProgress);
        
        // Check if this was the last module to complete the course
        if (newProgress === 100) {
            try {
                // Issue the certificate
                // const certificateResponse = await issueCertificate(courseId);
                // setCertificate(certificateResponse.data);
                setIsCourseCompleted(true);
                
                toast({
                    title: "Congratulations! 🎉",
                    description: "You've completed the course and earned a certificate!",
                    className: "bg-green-500 text-white",
                    duration: 5000
                });
            } catch (error) {
                console.error("Error issuing certificate:", error);
                toast({
                    title: "Certificate Error",
                    description: "There was an error issuing your certificate. Please contact support.",
                    variant: "destructive"
                });
            }
        } else {
            toast({
                title: "Module Completed! 🎉",
                description: "Great job! You've completed this module.",
                className: "bg-green-500 text-white"
            });
        }
    } catch (error) {
        console.error("Error completing module:", error);
        toast({
            title: "Error",
            description: "Failed to complete module. Please try again.",
            variant: "destructive"
        });
    }
  };

  const handleVideoEnd = async () => {
    if (!course || !currentModuleData) return;
    await handleModuleCompletion();
    
    if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1);
    }
  };

  const handleNextLesson = () => {
    if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1);
    }
  };

  const handlePreviousLesson = () => {
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
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6938EF] mx-auto"></div>
          <p className="text-muted-foreground">Loading your learning experience...</p>
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
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-red-500 font-medium">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!course || !currentModuleData) {
    return (
      <div className={cn(
        "min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex items-center justify-center",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}>
        <div className="text-center space-y-4">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Course not found</p>
          <Button 
            onClick={() => navigate('/explore')}
            className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
          >
            Explore Courses
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
          "max-w-2xl w-full p-8 rounded-xl border shadow-lg",
          theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
        )}>
          <div className="w-20 h-20 bg-gradient-to-r from-[#6938EF] to-[#9D7BFF] rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-4">
            Congratulations! 🎉
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-8">
            You've successfully completed <span className="text-[#6938EF] font-medium">{course.title}</span>
          </p>
          {certificate && (
            <div className="mb-8 space-y-4">
              <div className={cn(
                "p-6 rounded-xl border",
                theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/20' : 'bg-accent/50 border-accent'
              )}>
                <h3 className="font-semibold mb-4">Your Digital Certificate</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Certificate ID: {certificate.certificateId}</p>
                  <p>Issued on: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                  <p>Valid until: {new Date(certificate.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-[#6938EF] to-[#9D7BFF] hover:from-[#5B2FD1] hover:to-[#8B6AE5] text-white"
                onClick={() => window.open(`/verify-certificate/${certificate.certificateId}`, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Certificate
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
        theme === 'dark' ? 'border-[#6938EF]/20 bg-[#0A0118]/95 backdrop-blur-sm' : 'border-border bg-background/95 backdrop-blur-sm'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSidebar(!showSidebar)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {showSidebar ? 'Hide course content' : 'Show course content'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div>
                <h1 className="text-xl font-semibold flex items-center gap-2">
                  {course.title}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleShare('copy')}>
                        <span className="flex items-center gap-2">
                          <Copy className="h-4 w-4" />
                          Copy course link
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('twitter')}>
                        <span className="flex items-center gap-2">
                          <Twitter className="h-4 w-4" />
                          Share on Twitter
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                        <span className="flex items-center gap-2">
                          <Linkedin className="h-4 w-4" />
                          Share on LinkedIn
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpenCheck className="h-4 w-4" />
                    {course.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {course.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    {course.duration}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Module {currentModule + 1} of {course.modules.length}
                </span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <div className="w-32">
                        <Progress 
                          value={progress} 
                          className="h-2" 
                          indicatorClassName="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF]" 
                        />
                      </div>
                      <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {completedModules.length} of {course.modules.length} modules completed
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
            
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex-1 p-4 sm:p-8 overflow-y-auto",
              showSidebar ? 'lg:w-[calc(100%-320px)]' : 'w-full'
            )}
          >
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 shadow-lg relative group">
              <div id="youtube-player" className="w-full h-full"></div>
              <div className="absolute bottom-0 left-0 right-0">
                <div className="h-1 bg-black/20">
                  <div 
                    className="h-full bg-gradient-to-r from-[#6938EF] to-[#9D7BFF] transition-all duration-1000"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
                <div className="bg-gradient-to-t from-black/50 to-transparent p-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center justify-between text-white">
                    <div className="text-sm font-medium">{currentModuleData.title}</div>
                    <div className="text-sm">{Math.round(videoProgress)}% completed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Module Content */}
            <div className="space-y-8">
              <div className={cn(
                "p-6 rounded-xl border shadow-sm",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    theme === 'dark' ? 'bg-[#6938EF]/20 text-[#6938EF]' : 'bg-[#6938EF]/10 text-[#6938EF]'
                  )}>
                    Module {currentModule + 1}
                  </div>
                  {completedModules.includes(currentModuleData._id) ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs"
                    >
                      <CheckCircle className="h-3 w-3" />
                      <span>Completed</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#6938EF]/10 text-[#6938EF] text-xs"
                    >
                      <Play className="h-3 w-3" />
                      <span>{Math.round(videoProgress)}% watched</span>
                    </motion.div>
                  )}
                </div>
                <h2 className="text-2xl font-semibold mb-3">{currentModuleData.title}</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">{currentModuleData.content}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={handlePreviousLesson}
                        disabled={currentModule === 0}
                        className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous Module
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {currentModule > 0 ? course.modules[currentModule - 1].title : 'This is the first module'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleNextLesson}
                        disabled={currentModule === course.modules.length - 1}
                        className="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF] hover:from-[#5B2FD1] hover:to-[#8B6AE5] text-white"
                      >
                        Next Module
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {currentModule < course.modules.length - 1 ? course.modules[currentModule + 1].title : 'You\'ve reached the last module'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: showSidebar ? 320 : 0 }}
          className={cn(
            "border-l overflow-hidden",
            theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
          )}
        >
          <div className="w-80 h-full overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Course Content</h2>
                <div className="text-sm text-muted-foreground">
                  {completedModules.length} of {course.modules.length} completed
                </div>
              </div>
              <div className="space-y-2">
                {course.modules.map((module, moduleIndex) => (
                  <motion.div
                    key={moduleIndex}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                      currentModule === moduleIndex
                        ? 'bg-[#6938EF]/10 text-[#6938EF]'
                        : 'hover:bg-accent'
                    )}
                    onClick={() => setCurrentModule(moduleIndex)}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300",
                      currentModule === moduleIndex
                        ? 'bg-[#6938EF] text-white'
                        : completedModules.includes(module._id)
                        ? 'bg-green-500 text-white'
                        : 'bg-accent text-muted-foreground'
                    )}>
                      {completedModules.includes(module._id) ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Video className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          {module.title}
                        </span>
                        {completedModules.includes(module._id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </motion.div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {module.content.substring(0, 50)}...
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseLearning;