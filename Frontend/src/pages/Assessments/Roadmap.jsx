import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import domtoimage from 'dom-to-image';
import confetti from 'canvas-confetti';
import { cn } from "@/lib/utils";
import { Image, Loader2, Rocket, Database, Code2, Blocks, Trophy } from 'lucide-react';
import { useTheme } from "../../components/theme-provider";
import Recommends from './Recommends';

const RoadmapPage = () => {
  const { theme } = useTheme();
  const roadmapRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isDownloading, setIsDownloading] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Web Fundamentals",
      description: "Your journey begins here! Master the core technologies.",
      topics: ["HTML5", "CSS3", "JavaScript"],
      duration: "4 weeks",
      color: "#6938EF",
      icon: <Rocket className="w-6 h-6 sm:w-8 sm:h-8" />,
    },
    {
      id: 2,
      title: "React Basics",
      description: "Level up with modern UI development!",
      topics: ["JSX", "Components", "Props & State"],
      duration: "6 weeks",
      color: "#6938EF",
      icon: <Code2 className="w-6 h-6 sm:w-8 sm:h-8" />,
    },
    {
      id: 3,
      title: "Advanced React",
      description: "Become a React ninja!",
      topics: ["Hooks", "Context", "Redux"],
      duration: "8 weeks",
      color: "#6938EF",
      icon: <Blocks className="w-6 h-6 sm:w-8 sm:h-8" />,
    },
    {
      id: 4,
      title: "Backend Integration",
      description: "Connect everything together!",
      topics: ["APIs", "Authentication", "Database"],
      duration: "6 weeks",
      color: "#6938EF",
      icon: <Database className="w-6 h-6 sm:w-8 sm:h-8" />,
    },
    {
      id: 5,
      title: "Full Stack Project",
      description: "Show off your skills!",
      topics: ["Architecture", "Deployment", "Testing"],
      duration: "8 weeks",
      color: "#6938EF",
      icon: <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />,
    }
  ];

  const handleStepComplete = (index) => {
    if (!completedSteps.has(index)) {
      const newCompleted = new Set(completedSteps);
      newCompleted.add(index);
      setCompletedSteps(newCompleted);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6938EF', '#9D7BFF', '#ffffff']
      });
    }
  };

  const downloadAsPNG = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const element = roadmapRef.current;
      
      // Create a temporary container with fixed width
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '1200px'; // Fixed width to ensure all content is captured
      
      // Clone the roadmap content
      const clone = element.cloneNode(true);
      clone.style.width = '100%';
      clone.style.height = 'auto';
      clone.style.backgroundColor = theme === 'dark' ? '#0A0118' : '#ffffff';
      
      container.appendChild(clone);
      document.body.appendChild(container);

      const dataUrl = await domtoimage.toPng(clone, {
        quality: 1.0,
        width: 1200,
        height: clone.offsetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      document.body.removeChild(container);
      
      const link = document.createElement('a');
      link.download = `learning-roadmap-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Download failed:', error);
    }
    setIsDownloading(false);
  };

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)] p-4 sm:p-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-4xl mx-auto">
        <h1 className={cn(
          "text-xl sm:text-2xl font-bold mb-4 sm:mb-6",
          theme === 'dark' ? 'text-white' : 'text-foreground'
        )}>
          Your Learning Path
        </h1>
        
        <div ref={roadmapRef} data-roadmap className={cn(
          "relative p-6 sm:p-12 rounded-2xl shadow-2xl border w-full",
          theme === 'dark' 
            ? 'bg-[#110C1D] border-[#6938EF]/20' 
            : 'bg-card border-border'
        )}>
          <div className={cn(
            "absolute w-0.5 top-12 bottom-12 left-1/2 transform -translate-x-1/2",
            theme === 'dark'
              ? 'bg-gradient-to-b from-[#6938EF] via-[#9D7BFF] to-[#6938EF]'
              : 'bg-gradient-to-b from-[#6938EF] via-[#9D7BFF] to-[#6938EF]'
          )} />
          
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative mb-12 sm:mb-20 last:mb-0"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                className={cn(
                  "relative cursor-pointer",
                  index % 2 === 0 
                    ? "ml-auto mr-[calc(50%+1.5rem)] sm:mr-[calc(50%+3rem)]" 
                    : "ml-[calc(50%+1.5rem)] sm:ml-[calc(50%+3rem)]"
                )}
                style={{ width: "calc(50% - 2rem)" }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setActiveStep(index);
                  handleStepComplete(index);
                }}
              >
                <div className="flex items-start gap-2 sm:gap-4">
                  <div
                    className={cn(
                      "relative w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center transition-all duration-300",
                      theme === 'dark' 
                        ? 'bg-[#110C1D] text-[#6938EF]' 
                        : 'bg-background text-[#6938EF]'
                    )}
                    style={{
                      borderColor: completedSteps.has(index) ? "#6938EF" : "#2A2438",
                      boxShadow: completedSteps.has(index) ? "0 0 15px #6938EF" : "none"
                    }}
                  >
                    {step.icon}
                    {completedSteps.has(index) && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-[#6938EF] rounded-full flex items-center justify-center text-[8px] sm:text-[10px] text-white font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>

                  <div
                    className={cn(
                      "p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 flex-1 backdrop-blur-sm transition-all duration-300",
                      theme === 'dark' 
                        ? 'bg-[#1A1425]/50' 
                        : 'bg-white/50'
                    )}
                    style={{
                      borderColor: completedSteps.has(index) ? "#6938EF" : "#2A2438",
                      boxShadow: completedSteps.has(index) ? "0 0 20px #6938EF20" : "none"
                    }}
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h3 className={cn(
                        "font-bold text-base sm:text-lg",
                        theme === 'dark' ? 'text-white' : 'text-[#1A1425]'
                      )}>
                        {step.title}
                      </h3>
                      <span
                        className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: "#6938EF20",
                          color: "#6938EF"
                        }}
                      >
                        {step.duration}
                      </span>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                      {step.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {step.topics.map((topic, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#2A2438] text-gray-300 border border-[#6938EF]/20"
                        >
                          {topic}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 flex justify-center space-x-4">
          <button
            onClick={downloadAsPNG}
            disabled={isDownloading}
            className="group px-4 sm:px-6 py-2 sm:py-3 bg-[#6938EF] text-white text-sm sm:text-base rounded-xl hover:bg-[#5B2FD1] transition-all flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-[#6938EF]/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Image className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
            )}
            <span className="font-medium">Save as Image</span>
          </button>
        </div>
      </div>
      <Recommends/>
    </div>
  );
};

export default RoadmapPage;