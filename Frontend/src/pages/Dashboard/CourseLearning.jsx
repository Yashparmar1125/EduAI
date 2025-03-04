import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { 
  PlayCircle, 
  CheckCircle,
  Clock,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CourseLearning = () => {
  const { theme } = useTheme();
  const [currentVideo, setCurrentVideo] = useState(1);

  const courseVideos = [
    {
      id: 1,
      title: "Introduction to Design Thinking",
      duration: "10:30",
      isCompleted: true,
      isCurrent: true,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
    },
    {
      id: 2,
      title: "Understanding the Design Process",
      duration: "15:45",
      isCompleted: false,
      isCurrent: false,
      description: "Supported by design thinking"
    },
    {
      id: 3,
      title: "Design Research",
      duration: "12:20",
      isCompleted: false,
      isCurrent: false,
      description: "Understanding user needs and behaviors"
    },
    // Add more videos as needed
  ];

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)] p-4 sm:p-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Video Player Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "rounded-2xl border overflow-hidden mb-6",
            theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
          )}
        >
          <div className="aspect-video bg-black/90 relative">
            {/* Video Player Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-[#6938EF] flex items-center justify-center"
              >
                <PlayCircle className="h-10 w-10 text-white" />
              </motion.div>
            </div>
            
            {/* Video Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
              <div className="h-full bg-[#6938EF]" style={{ width: '35%' }} />
            </div>
          </div>
        </motion.div>

        {/* Lecture Notes */}
        <div className="mb-6">
          <h2 className={cn(
            "text-lg font-semibold mb-2",
            theme === 'dark' ? 'text-white' : 'text-foreground'
          )}>
            Lecture Notes
          </h2>
          <div className={cn(
            "p-4 rounded-xl border",
            theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
          )}>
            <p className="text-sm text-muted-foreground">
              {courseVideos[currentVideo - 1].description}
            </p>
          </div>
        </div>

        {/* Course Videos List */}
        <div className="space-y-3">
          {courseVideos.map((video) => (
            <motion.div
              key={video.id}
              whileHover={{ scale: 1.01 }}
              className={cn(
                "p-4 rounded-xl border cursor-pointer",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border',
                video.isCurrent && 'border-[#6938EF] bg-[#6938EF]/5'
              )}
              onClick={() => setCurrentVideo(video.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    video.isCompleted ? "bg-green-500/10" : "bg-[#6938EF]/10"
                  )}>
                    {video.isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <PlayCircle className="h-4 w-4 text-[#6938EF]" />
                    )}
                  </div>
                  <div>
                    <h3 className={cn(
                      "font-medium",
                      video.isCurrent ? "text-[#6938EF]" : "text-foreground"
                    )}>
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      {video.duration}
                    </div>
                  </div>
                </div>
                <ChevronRight className={cn(
                  "h-5 w-5",
                  video.isCurrent ? "text-[#6938EF]" : "text-muted-foreground"
                )} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;