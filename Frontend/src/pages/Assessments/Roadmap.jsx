import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { cn } from "@/lib/utils";
import { Download, Image, Loader2, Rocket, Database, Code2, Blocks, Trophy } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
// Update this import line
import { useTheme } from "../../components/theme-provider";
const RoadmapPage = () => {
  const { theme } = useTheme();
  const roadmapRef = useRef(null);
  const componentRef = useRef();
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
      icon: <Rocket className="w-8 h-8" />,
    },
    {
      id: 2,
      title: "React Basics",
      description: "Level up with modern UI development!",
      topics: ["JSX", "Components", "Props & State"],
      duration: "6 weeks",
      color: "#6938EF",
      icon: <Code2 className="w-8 h-8" />,
    },
    {
      id: 3,
      title: "Advanced React",
      description: "Become a React ninja!",
      topics: ["Hooks", "Context", "Redux"],
      duration: "8 weeks",
      color: "#6938EF",
      icon: <Blocks className="w-8 h-8" />,
    },
    {
      id: 4,
      title: "Backend Integration",
      description: "Connect everything together!",
      topics: ["APIs", "Authentication", "Database"],
      duration: "6 weeks",
      color: "#6938EF",
      icon: <Database className="w-8 h-8" />,
    },
    {
      id: 5,
      title: "Full Stack Project",
      description: "Show off your skills!",
      topics: ["Architecture", "Deployment", "Testing"],
      duration: "8 weeks",
      color: "#6938EF",
      icon: <Trophy className="w-8 h-8" />,
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
  // Update the download functions
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'learning-roadmap',
    onBeforeGetContent: () => setIsDownloading(true),
    onAfterPrint: () => {
      setIsDownloading(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    },
    pageStyle: `
      @media print {
        body {
          background: #0A0118;
        }
        @page {
          size: landscape;
          margin: 0;
        }
      }
    `
  });

  const downloadAsPNG = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const element = roadmapRef.current;
      const canvas = await html2canvas(element, {
        backgroundColor: theme === 'dark' ? '#0A0118' : '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = 'roadmap.png';
      link.href = canvas.toDataURL('image/png');
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

  const downloadAsPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const element = roadmapRef.current;
      const canvas = await html2canvas(element, {
        backgroundColor: theme === 'dark' ? '#0A0118' : '#ffffff',
        scale: 2,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('roadmap.pdf');

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

  // Update the main container's className to support theme
  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)] p-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-4xl mx-auto">
        <h1 className={cn(
          "text-2xl font-bold mb-6",
          theme === 'dark' ? 'text-white' : 'text-foreground'
        )}>
          Your Learning Path
        </h1>
        
        <div ref={roadmapRef} className={cn(
          "relative p-12 rounded-2xl shadow-2xl border",
          theme === 'dark' 
            ? 'bg-[#110C1D] border-[#6938EF]/20' 
            : 'bg-card border-border'
        )}>
          <div className={cn(
            "absolute w-0.5 h-full left-1/2 transform -translate-x-1/2",
            theme === 'dark'
              ? 'bg-gradient-to-b from-[#6938EF] via-[#9D7BFF] to-[#6938EF]'
              : 'bg-gradient-to-b from-primary via-primary/70 to-primary'
          )} />
          
          {/* Update step cards */}
          {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="relative mb-20 last:mb-0"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div
                  className={cn(
                    "absolute h-[2px]",
                    index % 2 === 0 ? "-right-12 w-12" : "-left-12 w-12"
                  )}
                  style={{
                    top: "2.5rem",
                    background: "#6938EF",
                    boxShadow: "0 0 8px #6938EF"
                  }}
                />

                <motion.div
                  className={cn(
                    "relative cursor-pointer",
                    index % 2 === 0 ? "ml-auto mr-[calc(50%+3rem)]" : "ml-[calc(50%+3rem)]"
                  )}
                  style={{ width: "calc(50% - 4rem)" }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setActiveStep(index);
                    handleStepComplete(index);
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "relative w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-300",
                        theme === 'dark' 
                          ? 'bg-[#110C1D] text-[#6938EF]' 
                          : 'bg-background text-primary'
                      )}
                      style={{
                        borderColor: completedSteps.has(index) ? "#6938EF" : "#2A2438",
                        boxShadow: completedSteps.has(index) ? "0 0 15px #6938EF" : "none"
                      }}
                    >
                      {step.icon}
                      {completedSteps.has(index) && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-4 h-4 bg-[#6938EF] rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </div>

                    <div
                      className={cn(
                        "p-5 rounded-2xl border-2 flex-1 backdrop-blur-sm transition-all duration-300",
                        theme === 'dark' 
                          ? 'bg-[#1A1425]/50' 
                          : 'bg-card/50'
                      )}
                      style={{
                        borderColor: completedSteps.has(index) ? "#6938EF" : "#2A2438",
                        boxShadow: completedSteps.has(index) ? "0 0 20px #6938EF20" : "none"
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-white text-lg">
                          {step.title}
                        </h3>
                        <span
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: "#6938EF20",
                            color: "#6938EF"
                          }}
                        >
                          {step.duration}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-4">
                        {step.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {step.topics.map((topic, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-xs px-3 py-1.5 rounded-lg bg-[#2A2438] text-gray-300 border border-[#6938EF]/20"
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
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={downloadAsPNG}
            disabled={isDownloading}
            className="group px-6 py-3 bg-[#6938EF] text-white rounded-xl hover:bg-[#5B2FD1] transition-all flex items-center gap-3 shadow-lg hover:shadow-[#6938EF]/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Image className="w-5 h-5 transition-transform group-hover:scale-110" />
            )}
            <span className="font-medium">Save as Image</span>
          </button>
          <button
            onClick={downloadAsPDF}
            disabled={isDownloading}
            className="group px-6 py-3 bg-[#6938EF] text-white rounded-xl hover:bg-[#5B2FD1] transition-all flex items-center gap-3 shadow-lg hover:shadow-[#6938EF]/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5 transition-transform group-hover:scale-110" />
            )}
            <span className="font-medium">Download PDF</span>
          </button>
        </div>
      </div>
    
  );
};

export default RoadmapPage;