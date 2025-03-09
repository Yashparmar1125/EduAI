import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { 
  Award, 
  Calendar, 
  User, 
  FileCheck, 
  ExternalLink, 
  Facebook, 
  Twitter, 
  Linkedin,
  Copy,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useTheme } from "../../components/theme-provider";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const CertificateDetails = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If certificate data was passed via navigation state, use it
    if (location.state?.certificateData) {
      setCertificateData(location.state.certificateData);
      setLoading(false);
    } else {
      // Otherwise fetch it using the ID from the URL
      // In a real app, you would fetch from an API
      // This is a placeholder for demonstration
      setTimeout(() => {
        setCertificateData({
          id: id || "PY-2023-2982Abc2",
          studentName: "Sarah Johnson",
          courseName: "Python Basics",
          completionDate: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          grade: "A+",
          instructor: "Dr. Alex Thompson",
          skills: ["Python Syntax", "Data Structures", "File Handling", "Error Handling"],
          issueDate: "October 15, 2023",
          validUntil: "Lifetime",
          issuedBy: "EduAI Learning Platform"
        });
        setLoading(false);
      }, 1000);
    }
  }, [id, location.state]);

  const goBackToCertificate = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6938EF]" />
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)] p-4 sm:p-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2",
                theme === 'dark' ? 'border-[#6938EF]/20 hover:bg-[#6938EF]/10 text-white' : 'border-border'
              )}
              onClick={goBackToCertificate}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Certificate</span>
            </Button>
          </div>
          
          <h1 className={cn(
            "text-xl sm:text-2xl font-bold",
            theme === 'dark' ? 'text-white' : 'text-foreground'
          )}>
            Certificate Details
          </h1>
        </div>

        {/* Certificate Details and Verification Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Certificate Preview */}
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
                Certificate Preview
              </h3>
              
              <p className={cn(
                "text-sm mb-4",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                This certificate serves as proof of your successful completion of the {certificateData.courseName} course.
                You can share it on social media, or add it to your LinkedIn profile.
              </p>
              
              <div className="p-4 border border-dashed rounded-lg mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6938EF] to-[#9D7BFF] flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-sm font-semibold",
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {certificateData.courseName}
                      </h3>
                      <p className="text-xs text-gray-500">Certificate of Completion</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Completed on</p>
                    <p className={cn(
                      "text-sm",
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      {certificateData.completionDate}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#6938EF]/20 to-[#9D7BFF]/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-[#6938EF]" />
                  </div>
                  
                  <div>
                    <h4 className={cn(
                      "font-medium",
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {certificateData.studentName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Successfully completed with grade: {certificateData.grade}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {certificateData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs",
                        theme === 'dark'
                          ? 'bg-[#1A1425] text-gray-200 border border-[#6938EF]/30'
                          : 'bg-[#F9F5FF] text-[#6938EF] border border-[#6938EF]/20'
                      )}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-dashed">
                  <div>
                    <p className="text-xs text-gray-500">Instructor</p>
                    <p className={cn(
                      "text-sm",
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {certificateData.instructor}
                    </p>
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
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  variant="outline"
                  className={cn(
                    "flex items-center gap-2",
                    theme === 'dark' ? 'border-[#6938EF]/20 hover:bg-[#6938EF]/10 text-white' : 'border-border'
                  )}
                  onClick={goBackToCertificate}
                >
                  <ArrowLeft className="w-4 h-4" />
                  View Full Certificate
                </Button>
              </div>
            </div>
            
            {/* Other Certificates Section */}
            <div className={cn(
              "mt-6 p-4 rounded-xl border",
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
                  onClick={() => {
                    navigator.clipboard.writeText(certificateData.id);
                    // Add toast notification here if you have a toast component
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                </div>
                
                <div className="space-y-3 mb-4">
                  {[
                    { icon: <Calendar className="h-4 w-4" />, label: "Issue Date", value: certificateData.issueDate },
                    { icon: <Calendar className="h-4 w-4" />, label: "Valid Until", value: certificateData.validUntil },
                    { icon: <User className="h-4 w-4" />, label: "Issued To", value: certificateData.studentName },
                    { icon: <Award className="h-4 w-4" />, label: "Issued By", value: certificateData.issuedBy }
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

export default CertificateDetails;