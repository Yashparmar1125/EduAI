import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from "../../components/theme-provider";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  Book, 
  CheckCircle,
  XCircle,
  ExternalLink,
  BookOpen,
  Clock,
  Trophy,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Share2,
  Copy,
  Twitter,
  Linkedin,
  Timer,
  GraduationCap,
  BookOpenCheck,
  Menu,
  X,
  Video,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { getCustomById, updateModuleProgress } from '../../api/axios.api';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PersonalizedCourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [course, setCourse] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [progress, setProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const playerRef = useRef(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const progressUpdateInterval = useRef(null);
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0);
  const [isProgressUpdating, setIsProgressUpdating] = useState(false);

  // Define currentModule after course state is initialized
  const currentModule = course?.modules?.[currentModuleIndex];

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (course?.progress) {
      // Set completed modules from progress data
      const completedModuleIds = course.progress
        .filter(p => p.completed)
        .map(p => p.moduleId);
      setCompletedModules(completedModuleIds);

      // Calculate overall progress
      const totalModules = course.modules.length;
      const completedCount = completedModuleIds.length;
      setProgress((completedCount / totalModules) * 100);

      // Set video progress for current module
      const currentModuleProgress = course.progress.find(
        p => p.moduleId === currentModule?._id
      );
      if (currentModuleProgress) {
        setVideoProgress(currentModuleProgress.videoProgress || 0);
        setLastProgressUpdate(currentModuleProgress.videoProgress || 0);
      }
    }
  }, [course, currentModule]);

  useEffect(() => {
    if (!course || !currentModule?.videoUrl) return;

    // Cleanup previous player
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    // Reset video progress state
    setVideoProgress(0);
    setLastProgressUpdate(0);
    setIsVideoPlaying(false);
    stopProgressTracking();

    let playerInitialized = false;

    const initializePlayer = () => {
      // Check if the container exists in DOM
      const playerContainer = document.getElementById('youtube-player');
      if (!playerContainer) {
        console.error('Player container not found');
        return;
      }

      // Clear any previous error messages
      playerContainer.innerHTML = '';

      const videoId = getYouTubeVideoId(currentModule.videoUrl);
      if (!videoId) {
        onPlayerError({ data: 2 }); // Invalid video ID error
        return;
      }

      try {
        playerRef.current = new window.YT.Player('youtube-player', {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            'autoplay': 0,
            'controls': 1,
            'rel': 0,
            'showinfo': 0,
            'modestbranding': 1,
            'origin': window.location.origin,
            'enablejsapi': 1,
            'widget_referrer': window.location.origin,
            'playsinline': 1
          },
          events: {
            'onReady': (event) => {
              console.log('YouTube player is ready');
              playerInitialized = true;
              // Only preload video after player is ready
              if (event.target && typeof event.target.preloadVideoById === 'function') {
                event.target.preloadVideoById(videoId);
              }
            },
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
          }
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
        onPlayerError({ data: 2 });
      }
    };

    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      tag.onload = () => {
        // Wait for the API to be ready
        if (window.YT && window.YT.Player) {
          initializePlayer();
        } else {
          window.onYouTubeIframeAPIReady = initializePlayer;
        }
      };
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else if (window.YT && window.YT.Player) {
      // If API is already loaded, initialize directly
      initializePlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      window.onYouTubeIframeAPIReady = null;
      playerInitialized = false;
    };
  }, [course, currentModule?.videoUrl, currentModuleIndex]);

  const getYouTubeVideoId = (url) => {
    if (!url) return '';
    // Support more URL formats
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]?.length === 11) return match[1];
    }
    
    return url; // Return the URL as is if it might be a direct video ID
  };

  const onPlayerError = (event) => {
    console.error("YouTube Player Error:", event);
    let errorMessage = "There was an error playing the video. Please try again.";
    
    // Handle specific YouTube player errors
    switch (event.data) {
      case 2:
        errorMessage = "Invalid video URL or ID. Please check the video link.";
        break;
      case 5:
        errorMessage = "The video content cannot be played in HTML5 player.";
        break;
      case 100:
        errorMessage = "The video has been removed or is private.";
        break;
      case 101:
      case 150:
        errorMessage = "This video cannot be embedded due to restrictions set by the content owner.";
        break;
    }

    toast({
      title: "Video Error",
      description: errorMessage,
      variant: "destructive",
    });

    // Update UI to show error state
    const playerContainer = document.getElementById('youtube-player');
    if (playerContainer) {
      playerContainer.innerHTML = `
        <div class="absolute inset-0 flex items-center justify-center bg-black/90">
          <div class="text-center p-6">
            <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p class="text-white mb-4">${errorMessage}</p>
            <a href="${currentModule.videoUrl}" target="_blank" rel="noopener noreferrer" 
               class="text-[#6938EF] hover:text-[#5B2FD1] underline">
              Watch on YouTube
            </a>
          </div>
        </div>
      `;
    }
  };

  const onPlayerStateChange = async (event) => {
    // Only handle events if player is properly initialized
    if (!playerRef.current) return;

    try {
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
    } catch (error) {
      console.error('Error in player state change:', error);
    }
  };

  const updateCurrentProgress = async () => {
    if (!playerRef.current || isProgressUpdating || !playerRef.current.getCurrentTime) return;

    try {
      setIsProgressUpdating(true);
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      
      if (!currentTime || !duration) return;

      const currentProgress = (currentTime / duration) * 100;

      if (currentProgress > lastProgressUpdate) {
        await updateModuleProgress(courseId, currentModule._id, {
          videoProgress: currentProgress,
          quizResults: quizSubmitted ? {
            score: calculateScore().score,
            total: calculateScore().total,
            percentage: calculateScore().percentage,
            answers: quizAnswers
          } : null
        });
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
          await updateCurrentProgress();
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

  const handleVideoEnd = async () => {
    if (!course || !currentModule) return;
    
    try {
      const updatedProgress = {
        videoProgress: 100,
        quizResults: quizSubmitted ? {
          score: calculateScore().score,
          total: calculateScore().total,
          percentage: calculateScore().percentage,
          answers: quizAnswers
        } : null,
        completed: true,
        completedAt: new Date().toISOString()
      };
      
      await updateModuleProgress(courseId, currentModule._id, updatedProgress);
      setCompletedModules(prev => [...prev, currentModule._id]);
      
      // Update overall progress
      setProgress(((completedModules.length + 1) / course.modules.length) * 100);
      
      toast({
        title: "Module Completed! 🎉",
        description: "Great job! You've completed this module.",
        className: "bg-green-500 text-white"
      });
      
      // Auto advance to next module
      if (currentModuleIndex < course.modules.length - 1) {
        handleNextModule();
      }
    } catch (error) {
      console.error("Error completing module:", error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
    };
  }, []);

  const fetchCourseData = async () => {
    try {
      const response = await getCustomById(courseId);
      setCourse(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to load course data');
      setLoading(false);
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

  const handleNextModule = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
      setShowQuiz(false);
      setQuizAnswers({});
      setQuizSubmitted(false);
      // Use passive scroll behavior
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
        passive: true
      });
    }
  };

  const handlePrevModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(prev => prev - 1);
      setShowQuiz(false);
      setQuizAnswers({});
      setQuizSubmitted(false);
      // Use passive scroll behavior
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
        passive: true
      });
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const calculateScore = () => {
    if (!quizSubmitted || !currentModule?.questions) return null;
    
    const totalQuestions = currentModule.questions.length;
    const correctAnswers = currentModule.questions.reduce((count, question, index) => {
      // Check if the selected answer matches the correct answer letter (A, B, C, D)
      const selectedOption = quizAnswers[index];
      const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(question.answer);
      const isCorrect = selectedOption === question.options[correctAnswerIndex];
      return isCorrect ? count + 1 : count;
    }, 0);
    
    return {
      score: correctAnswers,
      total: totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100)
    };
  };

  // Add passive event listeners for scroll events
  useEffect(() => {
    const addPassiveListener = (element) => {
      element.addEventListener('wheel', () => {}, { passive: true });
      element.addEventListener('touchstart', () => {}, { passive: true });
      element.addEventListener('touchmove', () => {}, { passive: true });
    };

    // Add passive listeners to scrollable elements
    const scrollableElements = document.querySelectorAll('.overflow-y-auto');
    scrollableElements.forEach(addPassiveListener);

    return () => {
      scrollableElements.forEach(element => {
        element.removeEventListener('wheel', () => {});
        element.removeEventListener('touchstart', () => {});
        element.removeEventListener('touchmove', () => {});
      });
    };
  }, []);

  if (loading) {
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

  if (!course || !currentModule) return null;

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)]",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      {/* Course Header */}
      <div className={cn(
        "border-b sticky top-0 z-10 backdrop-blur-xl",
        theme === 'dark' ? 'border-[#6938EF]/10 bg-[#0A0118]/80' : 'border-border/50 bg-background/80'
      )}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Header Content */}
          <div className="flex flex-col space-y-6">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/personalized')}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Courses
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {showSidebar ? 'Hide course content' : 'Show course content'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-[#6938EF]" />
                  <span className="text-sm font-medium">
                    Module {currentModuleIndex + 1} of {course.modules.length}
                  </span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-3">
                        <div className="w-40">
                          <Progress 
                            value={progress} 
                            className="h-2.5 rounded-full bg-[#6938EF]/10" 
                            indicatorClassName="bg-[#6938EF]" 
                          />
                        </div>
                        <span className="text-sm font-semibold min-w-[3rem] text-right">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {completedModules.length} of {course.modules.length} modules completed
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Course Title and Info */}
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <h1 className={cn(
                  "text-3xl font-bold flex items-center gap-3",
                  theme === 'dark' ? 'text-white' : 'text-foreground'
                )}>
                  <Sparkles className="w-7 h-7 text-[#6938EF]" />
                  {course.title}
                </h1>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <BookOpenCheck className="h-4 w-4 text-[#6938EF]" />
                    AI-Powered Learning
                  </span>
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-[#6938EF]" />
                    Personalized Path
                  </span>
                  <span className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-[#6938EF]" />
                    {course.modules.reduce((total, module) => {
                      const duration = parseInt(module.duration) || 0;
                      return total + duration;
                    }, 0)} weeks
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 border-[#6938EF]/20 hover:bg-[#6938EF]/5 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleShare('copy')} className="gap-3">
                    <Copy className="h-4 w-4" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('twitter')} className="gap-3">
                    <Twitter className="h-4 w-4" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('linkedin')} className="gap-3">
                    <Linkedin className="h-4 w-4" />
                    Share on LinkedIn
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-14rem)]">
        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentModuleIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex-1 px-6 py-8 overflow-y-auto",
              showSidebar ? 'lg:w-[calc(100%-320px)]' : 'w-full'
            )}
          >
            {/* Module Content */}
            <div className="max-w-4xl mx-auto space-y-8">
              <div className={cn(
                "p-8 rounded-2xl border",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/10' : 'bg-card border-border/50'
              )}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium",
                    theme === 'dark' ? 'bg-[#6938EF]/10 text-[#6938EF]' : 'bg-[#6938EF]/5 text-[#6938EF]'
                  )}>
                    Module {currentModuleIndex + 1}
                  </div>
                  {completedModules.includes(currentModule._id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm font-medium"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed</span>
                    </motion.div>
                  )}
                </div>

                <h2 className="text-3xl font-bold mb-8 leading-tight">{currentModule.title}</h2>

                {/* Video Player Section */}
                {currentModule.videoUrl && (
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-[#6938EF]" />
                        <span className="text-base font-medium">Video Content</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Cleanup previous player
                          if (playerRef.current) {
                            playerRef.current.destroy();
                            playerRef.current = null;
                          }
                          // Reset video states
                          setVideoProgress(0);
                          setLastProgressUpdate(0);
                          setIsVideoPlaying(false);
                          stopProgressTracking();
                          // Force player reinitialization
                          const videoId = getYouTubeVideoId(currentModule.videoUrl);
                          if (!videoId) {
                            onPlayerError({ data: 2 });
                            return;
                          }
                          // Clear previous player container
                          const playerContainer = document.getElementById('youtube-player');
                          if (playerContainer) {
                            playerContainer.innerHTML = '';
                          }
                          // Initialize new player
                          if (window.YT && window.YT.Player) {
                            playerRef.current = new window.YT.Player('youtube-player', {
                              height: '100%',
                              width: '100%',
                              videoId: videoId,
                              playerVars: {
                                'autoplay': 0,
                                'controls': 1,
                                'rel': 0,
                                'showinfo': 0,
                                'modestbranding': 1,
                                'origin': window.location.origin,
                                'enablejsapi': 1,
                                'widget_referrer': window.location.origin,
                                'playsinline': 1
                              },
                              events: {
                                'onReady': (event) => {
                                  console.log('YouTube player is ready');
                                  if (event.target && typeof event.target.preloadVideoById === 'function') {
                                    event.target.preloadVideoById(videoId);
                                  }
                                },
                                'onStateChange': onPlayerStateChange,
                                'onError': onPlayerError
                              }
                            });
                          }
                        }}
                        className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/5 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Player
                      </Button>
                    </div>
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
                      <div id="youtube-player" className="absolute inset-0" />
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-[#6938EF]" />
                        <span className="text-base font-medium">Video Progress</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-64">
                          <Progress 
                            value={videoProgress} 
                            className="h-2.5 rounded-full bg-[#6938EF]/10" 
                            indicatorClassName="bg-[#6938EF]" 
                          />
                        </div>
                        <span className="text-base font-semibold min-w-[4rem] text-right">
                          {Math.round(videoProgress)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-muted-foreground/90 leading-relaxed text-lg">{currentModule.content}</p>
                </div>
              </div>

              {/* Quiz Section */}
              {currentModule.questions?.length > 0 && (
                <div className={cn(
                  "rounded-2xl border overflow-hidden",
                  theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/10' : 'bg-card border-border/50'
                )}>
                  <div className="p-8">
                    <h3 className={cn(
                      "text-2xl font-bold mb-3 flex items-center gap-3",
                      theme === 'dark' ? 'text-white' : 'text-foreground'
                    )}>
                      <Trophy className="w-6 h-6 text-[#6938EF]" />
                      Module Assessment
                    </h3>
                    <p className="text-base text-muted-foreground/90 mb-8">
                      Test your knowledge of the concepts covered in this module
                    </p>

                    {!showQuiz ? (
                      <Button
                        onClick={() => setShowQuiz(true)}
                        className="w-full py-6 text-lg font-semibold bg-[#6938EF] hover:bg-[#5B2FD1] text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <PlayCircle className="w-5 h-5 mr-3" />
                        Start Quiz
                      </Button>
                    ) : (
                      <div className="space-y-8">
                        {currentModule.questions.map((question, questionIndex) => (
                          <div key={questionIndex} className="space-y-6">
                            <p className={cn(
                              "text-lg font-semibold",
                              theme === 'dark' ? 'text-white' : 'text-foreground'
                            )}>
                              {questionIndex + 1}. {question.question}
                            </p>
                            <div className="grid gap-4">
                              {Array.isArray(question.options) && question.options.map((option, optionIndex) => {
                                const answerLetter = ['A', 'B', 'C', 'D'][optionIndex];
                                const isCorrectAnswer = quizSubmitted && question.answer === answerLetter;
                                
                                return (
                                  <button
                                    key={optionIndex}
                                    onClick={() => !quizSubmitted && handleAnswerSelect(questionIndex, option)}
                                    className={cn(
                                      "w-full px-6 py-4 rounded-xl text-left transition-all flex items-center gap-4 text-base",
                                      quizSubmitted
                                        ? isCorrectAnswer
                                          ? "bg-green-500/10 text-green-500 border border-green-500"
                                          : option === quizAnswers[questionIndex]
                                          ? "bg-red-500/10 text-red-500 border border-red-500"
                                          : theme === 'dark' ? "bg-[#1A1425]/50" : "bg-gray-50/50"
                                        : quizAnswers[questionIndex] === option
                                        ? "bg-[#6938EF]/10 text-[#6938EF] border border-[#6938EF]"
                                        : theme === 'dark'
                                          ? "bg-[#1A1425]/50 hover:bg-[#1A1425]"
                                          : "bg-gray-50/50 hover:bg-gray-100"
                                    )}
                                  >
                                    <div className="flex items-center gap-4 flex-1">
                                      <span className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-sm">
                                        {answerLetter}
                                      </span>
                                      <span className="flex-1">{option}</span>
                                    </div>
                                    {quizSubmitted && (
                                      isCorrectAnswer ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                      ) : option === quizAnswers[questionIndex] ? (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                      ) : null
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        {!quizSubmitted ? (
                          <Button
                            onClick={handleQuizSubmit}
                            disabled={Object.keys(quizAnswers).length !== currentModule.questions.length}
                            className="w-full bg-[#6938EF] hover:bg-[#5B2FD1] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Submit Answers
                          </Button>
                        ) : (
                          <div className={cn(
                            "rounded-xl p-6 text-center",
                            calculateScore().percentage >= 70
                              ? "bg-green-500/10"
                              : "bg-red-500/10"
                          )}>
                            <h4 className={cn(
                              "text-xl font-semibold mb-2",
                              calculateScore().percentage >= 70
                                ? "text-green-500"
                                : "text-red-500"
                            )}>
                              Quiz Score: {calculateScore().score}/{calculateScore().total} ({calculateScore().percentage}%)
                            </h4>
                            <p className="text-muted-foreground/90 mb-4">
                              {calculateScore().percentage >= 70
                                ? "Great job! You've mastered this module."
                                : "Keep practicing! Try the quiz again to improve your score."
                              }
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowQuiz(false);
                                setQuizAnswers({});
                                setQuizSubmitted(false);
                              }}
                              className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/5 transition-colors"
                            >
                              Retry Quiz
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-[#6938EF]/10">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={handlePrevModule}
                        disabled={currentModuleIndex === 0}
                        className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/5 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous Module
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {currentModuleIndex > 0 ? course.modules[currentModuleIndex - 1].title : 'This is the first module'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleNextModule}
                        disabled={currentModuleIndex === course.modules.length - 1}
                        className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white transition-colors"
                      >
                        Next Module
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {currentModuleIndex < course.modules.length - 1 ? course.modules[currentModuleIndex + 1].title : 'You\'ve reached the last module'}
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
            theme === 'dark' ? 'border-[#6938EF]/10' : 'border-border/50'
          )}
        >
          <div className="w-80 h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Course Content</h2>
                <div className="text-sm font-medium text-muted-foreground/90">
                  {completedModules.length} of {course.modules.length} completed
                </div>
              </div>
              <div className="space-y-3">
                {course.modules.map((module, moduleIndex) => (
                  <motion.div
                    key={moduleIndex}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border",
                      currentModuleIndex === moduleIndex
                        ? 'bg-[#6938EF]/5 text-[#6938EF] border-[#6938EF]/20'
                        : 'hover:bg-accent/50 border-transparent'
                    )}
                    onClick={() => setCurrentModuleIndex(moduleIndex)}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300",
                      currentModuleIndex === moduleIndex
                        ? 'bg-[#6938EF] text-white'
                        : completedModules.includes(module._id)
                        ? 'bg-green-500 text-white'
                        : 'bg-accent/50 text-muted-foreground'
                    )}>
                      {completedModules.includes(module._id) ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Video className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base font-semibold truncate">
                          {module.title}
                        </span>
                        {completedModules.includes(module._id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                          >
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </motion.div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground/90 mt-1 line-clamp-2">
                        {module.content}
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

export default PersonalizedCourseLearning; 