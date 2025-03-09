import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import domtoimage from 'dom-to-image';
import confetti from 'canvas-confetti';
import { cn } from "@/lib/utils";
import { 
  Download, 
  Award, 
  CheckCircle, 
  Trophy, 
  Sparkles, 
  Loader2, 
  Share2,
  X,
  Copy,
  Calendar,
  User,
  FileCheck,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import { useTheme } from "../../components/theme-provider";
import { Button } from "@/components/ui/button";
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';

const Certificate = ({ 
  courseName = "Python Basics", 
  completionDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  studentName,
  courseId
}) => {
  const { theme } = useTheme();
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // Sample certificates for the "Other Verified Certificates" section
  const otherCertificates = [
    { id: "JS-2023-5678", name: "JavaScript Basics", date: "May 15, 2023", image: "/certificates/js-cert.png" },
    { id: "REACT-2023-9012", name: "React Fundamentals", date: "June 22, 2023", image: "/certificates/react-cert.png" },
    { id: "NODE-2023-3456", name: "Node.js Essentials", date: "July 10, 2023", image: "/certificates/node-cert.png" },
    { id: "CSS-2023-7890", name: "CSS Mastery", date: "August 5, 2023", image: "/certificates/css-cert.png" },
  ];

  useEffect(() => {
    // In a real app, you would fetch certificate data from an API
    // This is a placeholder for demonstration
    setCertificateData({
      id: courseId || "PY-2023-2982Abc2",
      studentName: studentName || user?.displayName || "Sarah Johnson",
      courseName: courseName,
      completionDate: completionDate,
      grade: "A+",
      instructor: "Dr. Alex Thompson",
      skills: ["Python Syntax", "Data Structures", "File Handling", "Error Handling"],
      issueDate: "October 15, 2023",
      validUntil: "Lifetime",
      issuedBy: "EduAI Learning Platform"
    });
  }, [courseName, completionDate, studentName, courseId, user]);

  const downloadAsPNG = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    
    try {
      const element = certificateRef.current;
      
      // Create a temporary container with fixed dimensions
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '1200px';
      
      // Clone the certificate content
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
      link.download = `${certificateData?.studentName.replace(/\s+/g, '-')}-${certificateData?.courseName.replace(/\s+/g, '-')}-certificate.png`;
      link.href = dataUrl;
      link.click();
      
      // Trigger confetti celebration
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#6938EF', '#9D7BFF', '#FFD700', '#00FFFF']
      });
    } catch (error) {
      console.error('Certificate download failed:', error);
    }
    
    setIsDownloading(false);
  };

  const copyId = () => {
    if (certificateData?.id) {
      navigator.clipboard.writeText(certificateData.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const viewCertificateDetails = () => {
    navigate(`/instructor/certificate-details/${certificateData.id}`, {
      state: { certificateData }
    });
  };

  if (!certificateData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6938EF]" />
      </div>
    );
  }

  const CertificateDisplay = () => (
    <div 
      ref={certificateRef} 
      className={cn(
        "relative p-8 sm:p-12 rounded-2xl shadow-2xl border w-full overflow-hidden",
        theme === 'dark'
          ? 'bg-[#110C1D] border-[#6938EF]/30'
          : 'bg-white border-[#6938EF]/20'
      )}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Top Left Corner Decoration */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#6938EF]/20 to-transparent blur-xl" />
        
        {/* Bottom Right Corner Decoration */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-tl from-[#9D7BFF]/20 to-transparent blur-xl" />
        
        {/* Center Decoration */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-[#6938EF]/5 to-[#9D7BFF]/5 blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle, ${theme === 'dark' ? '#6938EF' : '#6938EF'} 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
      </div>

      {/* Certificate Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6938EF] to-[#9D7BFF] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={cn(
                "text-sm font-semibold",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                EduAI
              </h3>
              <p className="text-xs text-gray-500">Certificate of Completion</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500">Certificate ID</p>
            <p className={cn(
              "text-sm font-mono",
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              {certificateData.id}
            </p>
          </div>
        </div>
        
        {/* Title */}
        <div className="text-center my-8">
          <h2 className={cn(
            "text-2xl sm:text-3xl md:text-4xl font-bold mb-2",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            Certificate of Achievement
          </h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-[#6938EF] to-[#9D7BFF] rounded-full" />
        </div>
        
        {/* Main Content */}
        <div className="text-center mb-8">
          <p className={cn(
            "text-sm mb-6",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            This is to certify that
          </p>
          
          <h3 className={cn(
            "text-xl sm:text-2xl md:text-3xl font-bold mb-6 font-serif",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {certificateData.studentName}
          </h3>
          
          <p className={cn(
            "text-sm mb-6",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            has successfully completed the course
          </p>
          
          <div className="relative inline-block mb-6">
            <h4 className={cn(
              "text-lg sm:text-xl md:text-2xl font-bold px-6 py-2 rounded-lg",
              theme === 'dark' 
                ? 'bg-[#1A1425] text-white border border-[#6938EF]/30' 
                : 'bg-[#F9F5FF] text-[#6938EF] border border-[#6938EF]/20'
            )}>
              {certificateData.courseName}
            </h4>
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-[#FFD700]" />
          </div>
          
          <p className={cn(
            "text-sm mb-2",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            with a grade of
          </p>
          
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#6938EF] to-[#9D7BFF] mb-6">
            <span className="text-white font-bold text-lg">{certificateData.grade}</span>
          </div>
          
          <p className={cn(
            "text-sm",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            on {certificateData.completionDate}
          </p>
        </div>
        
        {/* Skills Section */}
        <div className="mb-8">
          <h4 className={cn(
            "text-center text-sm font-semibold mb-3",
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          )}>
            Skills Acquired
          </h4>
          
          <div className="flex flex-wrap justify-center gap-2">
            {certificateData.skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full text-xs",
                  theme === 'dark'
                    ? 'bg-[#1A1425] text-gray-200 border border-[#6938EF]/30'
                    : 'bg-[#F9F5FF] text-[#6938EF] border border-[#6938EF]/20'
                )}
              >
                <CheckCircle className="w-3 h-3" />
                {skill}
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-end pt-6 border-t border-dashed border-gray-300 dark:border-gray-700">
          <div>
            <p className={cn(
              "text-xs mb-1",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              Instructor
            </p>
            <p className={cn(
              "text-sm font-medium",
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {certificateData.instructor}
            </p>
            <div className="mt-2 w-20 h-8">
              <svg viewBox="0 0 100 50" className="w-full h-full">
                <path
                  d="M10 25C10 25 20 10 30 25C40 40 50 10 60 25C70 40 80 10 90 25"
                  fill="none"
                  stroke={theme === 'dark' ? '#9D7BFF' : '#6938EF'}
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 opacity-80">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke={theme === 'dark' ? '#6938EF' : '#6938EF'} strokeWidth="2" />
                <path
                  d="M30 50L45 65L70 35"
                  fill="none"
                  stroke={theme === 'dark' ? '#9D7BFF' : '#6938EF'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <div className="w-20 h-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="certGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6938EF" />
                    <stop offset="100%" stopColor="#9D7BFF" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#certGradient)" strokeWidth="2" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="url(#certGradient)" strokeWidth="1" strokeDasharray="4 2" />
                <path
                  d="M50 20C60 20 70 30 70 40C70 48 65 54 50 65C35 54 30 48 30 40C30 30 40 20 50 20Z"
                  fill="url(#certGradient)"
                  opacity="0.7"
                />
              </svg>
            </div>
            <p className={cn(
              "text-xs mt-1",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              Official Seal
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)] p-4 sm:p-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={cn(
            "text-xl sm:text-2xl font-bold",
            theme === 'dark' ? 'text-white' : 'text-foreground'
          )}>
            Your Achievement Certificate
          </h1>
          
          <div className="flex gap-3">
            <Button
              onClick={downloadAsPNG}
              disabled={isDownloading}
              size="sm"
              className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white flex items-center gap-2"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Download</span>
            </Button>
          </div>
        </div>

        <CertificateDisplay />
        
        {/* Certificate Details and Verification Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Other Certificates */}
          <div className="md:col-span-2">
            <div className={cn(
              "p-4 rounded-xl border",
              theme === 'dark'
                ? 'bg-[#110C1D] border-[#6938EF]/30'
                : 'bg-white border-[#6938EF]/20'
            )}>
              <h3 className={cn(
                "text-lg font-semibold mb-4",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                Other Certificates
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { 
                    id: "JS-2023-5678", 
                    name: "JavaScript Fundamentals", 
                    date: "May 15, 2023",
                    instructor: "Prof. Michael Chen"
                  },
                  { 
                    id: "REACT-2023-9012", 
                    name: "React Development", 
                    date: "June 22, 2023",
                    instructor: "Dr. Emily Rodriguez"
                  },
                  { 
                    id: "NODE-2023-3456", 
                    name: "Node.js Backend", 
                    date: "July 10, 2023",
                    instructor: "Sarah Williams"
                  },
                  { 
                    id: "CSS-2023-7890", 
                    name: "Advanced CSS", 
                    date: "August 5, 2023",
                    instructor: "James Thompson"
                  }
                ].map((cert, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer",
                      theme === 'dark'
                        ? 'bg-[#1A1425] border-[#6938EF]/20 hover:border-[#6938EF]/40'
                        : 'bg-accent/50 border-[#6938EF]/10 hover:border-[#6938EF]/30'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6938EF]/20 to-[#9D7BFF]/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-[#6938EF]" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={cn(
                          "font-medium text-sm",
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>
                          {cert.name}
                        </h4>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {cert.date}
                          </p>
                          <span className="text-[#6938EF] text-xs">•</span>
                          <p className="text-xs text-muted-foreground truncate">
                            {cert.instructor}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-mono text-muted-foreground">
                            ID: {cert.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Certificate Verification */}
          <div className="md:col-span-1">
            <div className={cn(
              "p-4 rounded-xl border sticky top-4",
              theme === 'dark'
                ? 'bg-[#110C1D] border-[#6938EF]/30'
                : 'bg-white border-[#6938EF]/20'
            )}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#6938EF]/10 flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#6938EF]" />
                </div>
                <h3 className={cn(
                  "font-semibold",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  Certificate Verification
                </h3>
              </div>
              
              <p className={cn(
                "text-sm mb-4",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                This certificate can be verified using the unique ID below. Share this ID with employers or institutions to verify your achievement.
              </p>
              
              <div className={cn(
                "p-3 rounded-lg flex items-center justify-between mb-4",
                theme === 'dark'
                  ? 'bg-[#1A1425] border border-[#6938EF]/30'
                  : 'bg-[#F9F5FF] border border-[#6938EF]/20'
              )}>
                <span className="font-mono text-sm">
                  {certificateData.id}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={copyId}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3 mb-4">
                {[
                  { icon: <Calendar className="h-4 w-4" />, label: "Issue Date", value: "October 15, 2023" },
                  { icon: <Calendar className="h-4 w-4" />, label: "Valid Until", value: "Lifetime" },
                  { icon: <User className="h-4 w-4" />, label: "Issued To", value: certificateData.studentName },
                  { icon: <Award className="h-4 w-4" />, label: "Issued By", value: "EduAI Learning Platform" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      theme === 'dark' ? 'bg-[#1A1425]' : 'bg-[#F9F5FF]'
                    )}>
                      {React.cloneElement(item.icon, { 
                        className: `h-4 w-4 ${theme === 'dark' ? 'text-[#9D7BFF]' : 'text-[#6938EF]'}` 
                      })}
                    </div>
                    
                    <div className="flex-1">
                      <p className={cn(
                        "text-xs",
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        {item.label}
                      </p>
                      <p className={cn(
                        "text-sm font-medium",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                className="w-full bg-[#6938EF] hover:bg-[#5B2FD1] text-white flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                Verify Certificate
              </Button>
              
              <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-700">
                <p className={cn(
                  "text-sm font-medium mb-2",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  Share Your Achievement
                </p>
                
                <div className="flex items-center gap-2">
                  {[
                    { icon: <Linkedin className="h-4 w-4" />, color: "bg-[#0077B5]" },
                    { icon: <Twitter className="h-4 w-4" />, color: "bg-[#1DA1F2]" },
                    { icon: <Facebook className="h-4 w-4" />, color: "bg-[#4267B2]" },
                    { icon: <ExternalLink className="h-4 w-4" />, color: "bg-[#6938EF]" }
                  ].map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      className={cn(
                        "rounded-full h-8 w-8 p-0",
                        theme === 'dark' ? 'border-[#6938EF]/20 hover:bg-[#6938EF]/10' : 'border-border'
                      )}
                    >
                      {item.icon}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;