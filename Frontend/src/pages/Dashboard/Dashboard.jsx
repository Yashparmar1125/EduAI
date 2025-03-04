import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { 
  BookOpen, 
  ChevronDown, 
  Clock, 
  Filter, 
  MessageSquare, 
  Search, 
  Star, 
  User,
  BookMarked,
  BarChart3,
  Edit,
  Trophy,
  ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from 'react-router-dom';
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

import { useRef } from 'react';
import { useReward } from 'react-rewards';

const Dashboard = () => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("All Time");
  const [avatarStyle, setAvatarStyle] = useState('adventurer');
  const [avatarSeed, setAvatarSeed] = useState('ByteCoders');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  
  const avatarStyles = [
    { id: 'adventurer', label: 'Adventurer' },
    { id: 'lorelei', label: 'Lorelei' },
    { id: 'bottts', label: 'Robots' },
    { id: 'avataaars', label: 'Avataaars' },
    { id: 'funEmoji', label: 'Emoji' },
  ];

  useEffect(() => {
    let styleCollection;
    switch (avatarStyle) {
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
        seed: avatarSeed,
        size: 128,
      });

      const svg = avatar.toString();
      const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      setAvatarUrl(dataUrl);
    } catch (error) {
      console.error("Error generating avatar:", error);
    }
  }, [avatarStyle, avatarSeed]);

  // Mock data
  const user = {
    name: "ByteCoders",
    role: "FullStack Developer",
    avatar: avatarUrl || "/assets/avatar.png"
  };

  const learningPaths = [
    { id: 1, title: "Web Development", progress: 65 },
    { id: 2, title: "React Mastery", progress: 40 },
    { id: 3, title: "UI/UX Design", progress: 20 }
  ];

  const continueLearning = [
    {
      id: 1,
      title: "React Components",
      description: "Learn to create reusable components in React",
      progress: 75,
      duration: "45 mins left",
      image: "/assets/react.svg"
    },
    {
      id: 2,
      title: "CSS Fundamentals",
      description: "Master the core concepts of CSS styling",
      progress: 60,
      duration: "30 mins left",
      image: "/assets/css.svg"
    },
    {
      id: 3,
      title: "JavaScript Basics",
      description: "Understanding JavaScript fundamentals",
      progress: 40,
      duration: "1 hour left",
      image: "/assets/js.svg"
    }
  ];

  const trendingCourses = [
    {
      id: 1,
      title: "Python for Beginners",
      instructor: "Michael Johnson",
      students: 1245,
      rating: 4.8,
      image: "/assets/python.svg"
    },
    {
      id: 2,
      title: "UI/UX Design",
      instructor: "Sarah Williams",
      students: 987,
      rating: 4.7,
      image: "/assets/design.svg"
    },
    {
      id: 3,
      title: "Full Stack Development",
      instructor: "David Chen",
      students: 1532,
      rating: 4.9,
      image: "/assets/fullstack.svg"
    }
  ];

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

  const achievements = [
    {
      id: 1,
      title: "Fast Learner",
      description: "Completed 5 courses in a month",
      icon: "🚀",
      unlocked: true,
      progress: 100
    },
    {
      id: 2,
      title: "Code Master",
      description: "Solved 50 coding challenges",
      icon: "💻",
      unlocked: false,
      progress: 70
    },
    {
      id: 3,
      title: "Team Player",
      description: "Helped 10 community members",
      icon: "🤝",
      unlocked: false,
      progress: 40
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
                Welcome back, <span className="text-[#6938EF] dark:text-[#9D7BFF]">ByteCoders!</span> 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Achieve Your Learning Goals Faster!
              </p>
              <Button 
                className="mt-3 bg-[#6938EF] hover:bg-[#5B2FD1] text-white text-sm"
                size="sm"
              >
                Continue Learning
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <Avatar className="h-12 w-12 border-2 border-[#6938EF]/30">
                      <AvatarImage src={user.avatar} />
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
                        <AvatarImage src={avatarUrl} />
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
                              variant={avatarStyle === style.id ? "default" : "outline"}
                              className={cn(
                                "text-xs h-8",
                                avatarStyle === style.id 
                                  ? "bg-[#6938EF] hover:bg-[#5B2FD1] text-white" 
                                  : "border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
                              )}
                              onClick={() => setAvatarStyle(style.id)}
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
                            value={avatarSeed}
                            onChange={(e) => setAvatarSeed(e.target.value)}
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
                            onClick={() => setAvatarSeed(Math.random().toString(36).substring(7))}
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

          <div className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-4",
          )}>
            {learningPaths.map((path) => (
              <motion.div
                key={path.id}
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
                                          <h3 className="font-medium">{path.title}</h3>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{path.progress}%</span>
                                      </div>
                                      <Progress value={path.progress} className="h-2" 
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
                                        {continueLearning.map((course) => (
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
                                                  {course.duration}
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
                                        {trendingCourses.map((course) => (
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
                                                <span className="text-xs font-medium text-[#6938EF]">{course.rating}</span>
                                                <Star className="h-3 w-3 fill-[#6938EF] text-[#6938EF]" />
                                              </div>
                                              <div className="mt-auto">
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                  <User className="h-3 w-3" />
                                                  {course.instructor}
                                                </span>
                                                <div className="flex justify-between items-center mt-2">
                                                  <span className="text-xs text-muted-foreground">
                                                    {course.students} students
                                                  </span>
                                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-[#6938EF]">
                                                    Enroll
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
                                        {achievements.map((achievement) => (
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
                            </div>
                          </div>
                        );
                      };
                      
                      export default Dashboard;