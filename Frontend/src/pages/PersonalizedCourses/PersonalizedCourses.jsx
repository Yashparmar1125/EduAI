import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "../../components/theme-provider";
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { 
  Book, 
  Clock, 
  Trophy, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  Target,
  AlertCircle,
  FileText,
  BookOpenCheck,
  GraduationCap,
  Timer,
  Share2,
  Copy,
  Twitter,
  Linkedin
} from 'lucide-react';
import { getAllCustomCourses } from '../../api/axios.api';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PersonalizedCourses = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPersonalizedCourses();
  }, []);

  const fetchPersonalizedCourses = async () => {
    try {
      const response = await getAllCustomCourses();
      const coursesData = response.data || [];
      setCourses(coursesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching personalized courses:', error);
      setError('Failed to load your personalized courses');
      setLoading(false);
    }
  };

  const handleShare = async (platform, course) => {
    try {
      const shareUrl = `${window.location.origin}/personalized/${course._id}`;
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

  if (loading) {
    return (
      <div className={cn(
        "min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex items-center justify-center",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6938EF] mx-auto"></div>
          <p className="text-muted-foreground">Loading your personalized learning paths...</p>
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
            <div>
              <h1 className={cn(
                "text-2xl font-semibold flex items-center gap-2",
                theme === 'dark' ? 'text-white' : 'text-foreground'
              )}>
                <Sparkles className="w-6 h-6 text-[#6938EF]" />
                My Personalized Learning Paths
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <BookOpenCheck className="h-4 w-4" />
                  AI-Powered Learning
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  Tailored to Your Skills
                </span>
                <span className="flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  Adaptive Pacing
                </span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/assessment')}
              className="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF] hover:from-[#5B2FD1] hover:to-[#8B6AE5] text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Take New Assessment
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {(!courses || courses.length === 0) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className={cn(
              "max-w-md mx-auto p-8 rounded-2xl border",
              theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
            )}>
              <div className="w-20 h-20 bg-gradient-to-r from-[#6938EF] to-[#9D7BFF] rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className={cn(
                "text-xl font-semibold mb-2",
                theme === 'dark' ? 'text-white' : 'text-foreground'
              )}>
                Start Your Learning Journey
              </h2>
              <p className="text-muted-foreground mb-6">
                Take a quick assessment to get a personalized learning path tailored to your skills and goals.
              </p>
              <Button
                onClick={() => navigate('/assessment')}
                className="w-full bg-gradient-to-r from-[#6938EF] to-[#9D7BFF] hover:from-[#5B2FD1] hover:to-[#8B6AE5] text-white"
              >
                <Target className="w-4 h-4 mr-2" />
                Take Assessment
              </Button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "group rounded-2xl border overflow-hidden",
                    theme === 'dark'
                      ? 'bg-[#110C1D] border-[#6938EF]/20 hover:border-[#6938EF]/40'
                      : 'bg-card border-border hover:border-primary/40'
                  )}
                >
                  {course.poster && (
                    <div className="aspect-video w-full relative group">
                      <img
                        src={course.poster}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className={cn(
                        "text-lg font-semibold group-hover:text-[#6938EF] transition-colors line-clamp-2",
                        theme === 'dark' ? 'text-white' : 'text-foreground'
                      )}>
                        {course.title}
                      </h2>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleShare('copy', course)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare('twitter', course)}>
                            <Twitter className="h-4 w-4 mr-2" />
                            Share on Twitter
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare('linkedin', course)}>
                            <Linkedin className="h-4 w-4 mr-2" />
                            Share on LinkedIn
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Book className="w-4 h-4 mr-2 text-[#6938EF]" />
                        <span>{course.modules.length} Learning Modules</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 text-[#6938EF]" />
                        <span>
                          {course.modules.reduce((total, module) => {
                            const duration = parseInt(module.duration) || 0;
                            return total + duration;
                          }, 0)} weeks estimated
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Trophy className="w-4 h-4 mr-2 text-[#6938EF]" />
                        <span>
                          {course.modules.reduce((total, module) => total + (module.questions?.length || 0), 0)} Practice Questions
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Course Progress</span>
                        <span className="text-[#6938EF] font-medium">0%</span>
                      </div>
                      <Progress 
                        value={0} 
                        className="h-2" 
                        indicatorClassName="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF]" 
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        Created {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                      <Button
                        variant="ghost"
                        className="text-[#6938EF] hover:bg-[#6938EF]/10"
                        onClick={() => navigate(`/personalized/${course._id}`)}
                      >
                        Continue Learning
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default PersonalizedCourses; 