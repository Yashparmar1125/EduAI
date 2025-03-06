import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { useDispatch, useSelector } from 'react-redux';
import { 
  BookOpen, 
  ChevronDown, 
  Clock, 
  MessageSquare, 
  Star, 
  User,
  BookMarked,
  Edit,
  Trophy,
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from 'react-router-dom';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import { lorelei } from '@dicebear/collection';
import { bottts } from '@dicebear/collection';
import { avataaars } from '@dicebear/collection';
import { funEmoji } from '@dicebear/collection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  updateAvatarStyle, 
  updateAvatarSeed, 
  updateAvatarUrl,
  enrollInCourse 
} from '../../redux/slices/userSlice';
import { getDashboardData, enrollCourse } from '../../api/axios.api';
import { useToast } from '@/components/ui/toast';
const Dashboard = () => {
  const { theme } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redux state
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const avatarStyles = [
    { id: 'adventurer', label: 'Adventurer' },
    { id: 'lorelei', label: 'Lorelei' },
    { id: 'bottts', label: 'Robots' },
    { id: 'avataaars', label: 'Avataaars' },
    { id: 'funEmoji', label: 'Emoji' },
  ];

  useEffect(() => {
    let styleCollection;
    switch (user?.avatarStyle) {
      case 'lorelei':
        styleCollection = lorelei;
        break;
      case 'bottts':
        styleCollection = bottts;
        break;
      case 'avataaars':
        styleCollection = avataaars;
        break;
      case 'funEmoji':
        styleCollection = funEmoji;
        break;
      default:
        styleCollection = adventurer;
    }

    try {
      const avatar = createAvatar(styleCollection, {
        seed: user?.avatarSeed,
        size: 128,
      });

      const svg = avatar.toString();
      const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      dispatch(updateAvatarUrl(dataUrl));
    } catch (error) {
      console.error("Error generating avatar:", error);
    }
  }, [user?.avatarStyle, user?.avatarSeed, dispatch]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message || "Failed to fetch dashboard data");
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      // Ensure we're passing a string or number ID
      const id = typeof courseId === 'object' ? courseId.id : courseId;
      
      const response = await enrollCourse(id);
      if (response.success) {
        dispatch(enrollInCourse(id));
        toast({
          title: "Success",
          description: "Course enrolled successfully",
        });
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

  // Check if data is loading
  if (isLoading) {
    return (
      <div className={cn(
        "min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex items-center justify-center",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6938EF] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Check if there was an error
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

  // Check if user is new (no enrolled courses)
  const isNewUser = dashboardData?.isNewUser;

  // Mock data for community discussions
  const communityDiscussions = [
    {
      id: 1,
      user: {
        name: "Alex Thompson",
        avatar: "/assets/user1.png"
      },
      message: "Has anyone completed the React Hooks section? I'm finding useContext particularly challenging.",
      time: "2 hours ago",
      replies: 5
    },
    {
      id: 2,
      user: {
        name: "Sophia Martinez",
        avatar: "/assets/user2.png"
      },
      message: "Just finished the CSS Grid tutorial and it was amazing! Happy to help anyone who's stuck.",
      time: "4 hours ago",
      replies: 8
    }
  ];

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)] p-4 sm:p-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "p-6 sm:p-8 rounded-2xl shadow-lg border mb-8",
            theme === 'dark' 
              ? 'bg-[#110C1D] border-[#6938EF]/20' 
              : 'bg-card border-border'
          )}
        >
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className={cn(
                "text-xl sm:text-2xl font-bold",
                theme === 'dark' ? 'text-white' : 'text-foreground'
              )}>
                Welcome {isNewUser ? 'to EduAI' : 'back'}, <span className="text-[#6938EF] dark:text-[#9D7BFF]">{user.name}</span> 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isNewUser ? 'Start your learning journey today!' : 'Achieve Your Learning Goals Faster!'}
              </p>
              <Button 
                className="mt-3 bg-[#6938EF] hover:bg-[#5B2FD1] text-white text-sm"
                size="sm"
              >
                {isNewUser ? 'Explore Courses' : 'Continue Learning'}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <Avatar className="h-12 w-12 border-2 border-[#6938EF]/30">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-[#6938EF]/10 text-[#6938EF]">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Edit className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className={cn(
                  "sm:max-w-md",
                  theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
                )}>
                  <DialogHeader>
                    <DialogTitle className={theme === 'dark' ? 'text-white' : 'text-foreground'}>
                      Choose your avatar
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24 border-2 border-[#6938EF]/30">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-[#6938EF]/10 text-[#6938EF]">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className={cn(
                          "text-sm font-medium block mb-2",
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        )}>
                          Avatar Style
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {avatarStyles.map((style) => (
                            <Button
                              key={style.id}
                              variant={user.avatarStyle === style.id ? "default" : "outline"}
                              className={cn(
                                "text-xs h-8",
                                user.avatarStyle === style.id 
                                  ? "bg-[#6938EF] hover:bg-[#5B2FD1] text-white" 
                                  : "border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
                              )}
                              onClick={() => dispatch(updateAvatarStyle(style.id))}
                            >
                              {style.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className={cn(
                          "text-sm font-medium block mb-2",
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        )}>
                          Customize (enter any text)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={user.avatarSeed}
                            onChange={(e) => dispatch(updateAvatarSeed(e.target.value))}
                            className={cn(
                              "flex-1 px-3 py-2 text-sm rounded-md border",
                              theme === 'dark' 
                                ? 'bg-[#1A1425] border-[#6938EF]/20 text-white' 
                                : 'bg-background border-input text-foreground'
                            )}
                            placeholder="Enter text to generate avatar"
                          />
                          <Button 
                            className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
                            onClick={() => dispatch(updateAvatarSeed(Math.random().toString(36).substring(7)))}
                          >
                            Random
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline"
                      className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Save Avatar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <div>
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {isNewUser ? (
          // New User Dashboard
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Getting Started Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn(
                "p-6 rounded-xl border shadow-sm",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#6938EF]/10">
                  <Sparkles className="h-5 w-5 text-[#6938EF]" />
                </div>
                <h2 className="text-lg font-semibold">Getting Started</h2>
              </div>
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Welcome to EduAI! Let's help you begin your learning journey. Choose from the options below to get started.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Explore Courses Card */}
                  <div className={cn(
                    "p-4 rounded-xl border transition-all hover:border-[#6938EF]/30 cursor-pointer",
                    theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/10' : 'bg-accent/50 border-border'
                  )}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#6938EF]/10">
                        <BookOpen className="h-5 w-5 text-[#6938EF]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm mb-1">Explore Courses</h3>
                        <p className="text-xs text-muted-foreground mb-3">Browse our collection of courses and find what interests you</p>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs text-[#6938EF]"
                          onClick={() => navigate('/explore')}
                        >
                          Browse Now <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Skill Assessment Card */}
                  <div className={cn(
                    "p-4 rounded-xl border transition-all hover:border-[#6938EF]/30 cursor-pointer",
                    theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/10' : 'bg-accent/50 border-border'
                  )}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#6938EF]/10">
                        <Trophy className="h-5 w-5 text-[#6938EF]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm mb-1">Skill Assessment</h3>
                        <p className="text-xs text-muted-foreground mb-3">Take a quick assessment to identify your skill gaps</p>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs text-[#6938EF]"
                          onClick={() => navigate('/assessment')}
                        >
                          Start Assessment <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Join Community Card */}
                  <div className={cn(
                    "p-4 rounded-xl border transition-all hover:border-[#6938EF]/30 cursor-pointer",
                    theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/10' : 'bg-accent/50 border-border'
                  )}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#6938EF]/10">
                        <MessageSquare className="h-5 w-5 text-[#6938EF]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm mb-1">Join Community</h3>
                        <p className="text-xs text-muted-foreground mb-3">Connect with other learners and share experiences</p>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs text-[#6938EF]"
                        >
                          Join Now <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Learning Path Card */}
                  <div className={cn(
                    "p-4 rounded-xl border transition-all hover:border-[#6938EF]/30 cursor-pointer",
                    theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/10' : 'bg-accent/50 border-border'
                  )}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#6938EF]/10">
                        <BookMarked className="h-5 w-5 text-[#6938EF]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm mb-1">Learning Paths</h3>
                        <p className="text-xs text-muted-foreground mb-3">Follow structured learning paths for your goals</p>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs text-[#6938EF]"
                        >
                          View Paths <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trending Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn(
                "p-6 rounded-xl border shadow-sm",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}
            >
              <h2 className="text-lg font-semibold mb-4">Popular Courses</h2>
              <div className="space-y-4">
                {dashboardData.trendingCourses.map((course) => (
                  <div key={course.id} className={cn(
                    "p-4 rounded-lg border",
                    theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/10' : 'bg-accent/50 border-border'
                  )}>
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={course.poster} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm">{course.title}</h3>
                          <span className="text-xs font-medium text-[#6938EF]">{course.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{course.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {course.instructor}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{course.level}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {course.duration}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {course.students} students
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#6938EF]">{course.price}</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 px-2 text-xs text-[#6938EF]"
                              onClick={() => handleEnroll(course.id)}
                            >
                              Enroll Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full text-xs border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
                  onClick={() => navigate('/explore')}
                >
                  View All Courses
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          // Existing User Dashboard
          <>
            {/* Learning Paths Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className={cn(
                  "text-lg font-semibold",
                  theme === 'dark' ? 'text-white' : 'text-foreground'
                )}>
                  My Learning Paths
                </h2>
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
                  theme === 'dark' ? 'bg-[#1A1425]' : 'bg-accent'
                )}>
                  <span className="text-muted-foreground">Select One</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboardData.enrolledCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "p-5 rounded-xl border shadow-sm",
                      theme === 'dark' 
                        ? 'bg-[#110C1D] border-[#6938EF]/20' 
                        : 'bg-card border-border'
                    )}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          "bg-[#6938EF]/10 text-[#6938EF]"
                        )}>
                          <BookMarked className="h-4 w-4" />
                        </div>
                        <h3 className="font-medium">{course.title}</h3>
                      </div>
                      <span className="text-xs text-muted-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" 
                      indicatorClassName="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF]" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Continue Learning */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className={cn(
                    "rounded-xl border shadow-sm overflow-hidden",
                    theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
                  )}>
                    <div className="p-5 border-b border-border">
                      <h2 className={cn(
                        "text-lg font-semibold",
                        theme === 'dark' ? 'text-white' : 'text-foreground'
                      )}>
                        Continue Learning
                      </h2>
                    </div>
                    <div className="divide-y divide-border">
                      {dashboardData.enrolledCourses.map((course) => (
                        <div key={course.id} className={cn(
                          "flex gap-4 p-5 transition-all",
                          theme === 'dark' 
                            ? 'hover:bg-[#1A1425]/50' 
                            : 'hover:bg-accent'
                        )}>
                          <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                            theme === 'dark' ? 'bg-[#1A1425]' : 'bg-accent'
                          )}>
                            <BookOpen className="h-6 w-6 text-[#6938EF]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-sm">{course.title}</h3>
                              <span className="text-xs flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {course.duration || 'In Progress'}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{course.description}</p>
                            <Progress value={course.progress} className="h-1.5 mt-2" 
                              indicatorClassName="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Trending Courses */}
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
                        Trending Courses
                      </h2>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {dashboardData.trendingCourses.map((course) => (
                        <motion.div
                          key={course.id}
                          whileHover={{ scale: 1.03 }}
                          className={cn(
                            "p-4 rounded-xl border",
                            theme === 'dark' 
                              ? 'bg-[#1A1425]/50 border-[#6938EF]/10' 
                              : 'bg-accent/50 border-border'
                          )}
                        >
                          <div className="flex flex-col h-full">
                            <h3 className="font-medium text-sm mb-2">{course.title}</h3>
                            <div className="flex items-center gap-1 mb-3">
                              <span className="text-xs font-medium text-[#6938EF]">{course.rating || '4.5'}</span>
                              <Star className="h-3 w-3 fill-[#6938EF] text-[#6938EF]" />
                            </div>
                            <div className="mt-auto">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {course.instructor}
                              </span>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {course.studentsCount} students
                                </span>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 px-2 text-xs text-[#6938EF]"
                                  onClick={() => handleEnroll(course.id)}
                                >
                                  {course.enrolled ? 'Enrolled' : 'Enroll'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Community Discussions */}
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
                        Community Discussion
                      </h2>
                    </div>
                    <div className="p-5 space-y-4">
                      {communityDiscussions.map((discussion) => (
                        <div key={discussion.id} className={cn(
                          "p-3 rounded-xl transition-all",
                          theme === 'dark' 
                            ? 'bg-[#1A1425]/50 border border-[#6938EF]/10' 
                            : 'bg-accent/50 border border-accent'
                        )}>
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={discussion.user.avatar} />
                              <AvatarFallback className="bg-[#6938EF]/10 text-[#6938EF]">
                                {discussion.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="text-xs font-medium">{discussion.user.name}</h3>
                                <span className="text-[10px] text-muted-foreground">{discussion.time}</span>
                              </div>
                              <p className="text-xs mt-1">{discussion.message}</p>
                              <div className="flex justify-end mt-2">
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {discussion.replies} replies
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
                      >
                        View All Discussions
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Achievements Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className={cn(
                    "rounded-xl border shadow-sm",
                    theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
                  )}>
                    <div className="p-5 border-b border-border flex justify-between items-center">
                      <h2 className={cn(
                        "text-lg font-semibold",
                        theme === 'dark' ? 'text-white' : 'text-foreground'
                      )}>
                        Achievements
                      </h2>
                      <Link to="/achievements" className="text-xs text-[#6938EF] flex items-center gap-1 hover:underline">
                        View All <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="p-5 space-y-4">
                      {dashboardData.badges.map((achievement) => (
                        <div key={achievement.id} className={cn(
                          "p-3 rounded-xl transition-all",
                          theme === 'dark' 
                            ? 'bg-[#1A1425]/50 border border-[#6938EF]/10' 
                            : 'bg-accent/50 border border-accent',
                          !achievement.unlocked && 'opacity-70'
                        )}>
                          <div className="flex gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl",
                              achievement.unlocked 
                                ? "bg-[#6938EF]/20 text-[#6938EF]" 
                                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                            )}>
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="text-xs font-medium flex items-center gap-1">
                                  {achievement.title}
                                  {achievement.unlocked && (
                                    <Trophy className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                  )}
                                </h3>
                                <span className="text-[10px] text-muted-foreground">
                                  {achievement.unlocked ? 'Unlocked' : `${achievement.progress}%`}
                                </span>
                              </div>
                              <p className="text-xs mt-1 text-muted-foreground">{achievement.description}</p>
                              {!achievement.unlocked && (
                                <Progress value={achievement.progress} className="h-1.5 mt-2" 
                                  indicatorClassName="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF]" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <Link to="/achievements">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
                        >
                          View All Achievements
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;