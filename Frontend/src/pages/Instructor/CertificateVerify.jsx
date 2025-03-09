import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { 
  Award, 
  Search, 
  CheckCircle, 
  XCircle,
  Loader2,
  ArrowRight,
  User,
  Calendar,
  FileCheck
} from 'lucide-react';
import { useTheme } from "../../components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const CertificateVerify = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [certificateId, setCertificateId] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null); // null, 'loading', 'verified', 'invalid'
  const [certificateData, setCertificateData] = useState(null);
  // In the CertificateVerify component
  const location = useLocation();
  
  useEffect(() => {
    // If certificateId was passed via navigation state, use it
    if (location.state?.certificateId) {
      setCertificateId(location.state.certificateId);
      // Optionally auto-verify
      // verifyCertificate();
    }
  }, [location.state]);
  const certificateDatabase = {
    "PY-2023-2982Abc2": {
      id: "PY-2023-2982Abc2",
      studentName: "Sarah Johnson",
      courseName: "Python Basics",
      completionDate: "October 10, 2023",
      grade: "A+",
      instructor: "Dr. Alex Thompson",
      issueDate: "October 15, 2023",
      validUntil: "Lifetime",
      issuedBy: "EduAI Learning Platform"
    },
    "JS-2023-5678": {
      id: "JS-2023-5678",
      studentName: "Michael Brown",
      courseName: "JavaScript Fundamentals",
      completionDate: "May 15, 2023",
      grade: "A",
      instructor: "Prof. Michael Chen",
      issueDate: "May 20, 2023",
      validUntil: "Lifetime",
      issuedBy: "EduAI Learning Platform"
    },
    "REACT-2023-9012": {
      id: "REACT-2023-9012",
      studentName: "Emily Wilson",
      courseName: "React Development",
      completionDate: "June 22, 2023",
      grade: "A-",
      instructor: "Dr. Emily Rodriguez",
      issueDate: "June 25, 2023",
      validUntil: "Lifetime",
      issuedBy: "EduAI Learning Platform"
    }
  };
  const verifyCertificate = () => {
    if (!certificateId.trim()) return;
    
    setVerificationStatus('loading');
    
    // Simulate API call with timeout
    setTimeout(() => {
      const certificate = certificateDatabase[certificateId];
      
      if (certificate) {
        setVerificationStatus('verified');
        setCertificateData(certificate);
      } else {
        setVerificationStatus('invalid');
        setCertificateData(null);
      }
    }, 1500);
  };
  const viewCertificateDetails = () => {
    if (certificateData) {
      navigate(`/instructor/certificate-details/${certificateData.id}`, {
        state: { certificateData }
      });
    }
  };
  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)] p-4 sm:p-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6938EF]/20 to-[#9D7BFF]/20 flex items-center justify-center">
              <Award className={cn(
                "w-8 h-8",
                theme === 'dark' ? 'text-[#9D7BFF]' : 'text-[#6938EF]'
              )} />
            </div>
          </div>
          
          <h1 className={cn(
            "text-2xl sm:text-3xl font-bold mb-2",
            theme === 'dark' ? 'text-white' : 'text-foreground'
          )}>
            Certificate Verification
          </h1>
          
          <p className={cn(
            "text-sm max-w-md mx-auto",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            Enter the certificate ID to verify its authenticity. All certificates issued by EduAI can be verified using their unique ID.
          </p>
        </div>

        <div className={cn(
          "p-6 rounded-xl border mb-8",
          theme === 'dark'
            ? 'bg-[#110C1D] border-[#6938EF]/30'
            : 'bg-white border-[#6938EF]/20'
        )}>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Input
              placeholder="Enter certificate ID (e.g., PY-2023-2982Abc2)"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              className={cn(
                "flex-1",
                theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/20' : 'bg-background'
              )}
              onKeyDown={(e) => {
                if (e.key === 'Enter') verifyCertificate();
              }}
            />
            
            <Button
              onClick={verifyCertificate}
              disabled={verificationStatus === 'loading' || !certificateId.trim()}
              className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white flex items-center gap-2"
            >
              {verificationStatus === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Verify Certificate
            </Button>
          </div>
          
          {/* Sample certificate IDs for testing */}
          <div className="flex flex-wrap gap-2 mb-4">
            <p className={cn(
              "text-xs",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              Sample IDs for testing:
            </p>
            {Object.keys(certificateDatabase).map((id) => (
              <button
                key={id}
                onClick={() => setCertificateId(id)}
                className={cn(
                  "text-xs px-2 py-1 rounded-md",
                  theme === 'dark'
                    ? 'bg-[#1A1425] text-gray-300 hover:bg-[#1A1425]/80'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {id}
              </button>
            ))}
          </div>
          
          {/* Verification Result */}
          {verificationStatus && verificationStatus !== 'loading' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "p-4 rounded-lg border mt-6",
                verificationStatus === 'verified'
                  ? theme === 'dark'
                    ? 'bg-[#0D2E26] border-[#10B981]/30'
                    : 'bg-[#ECFDF5] border-[#10B981]/20'
                  : theme === 'dark'
                    ? 'bg-[#2C1A1A] border-[#EF4444]/30'
                    : 'bg-[#FEF2F2] border-[#EF4444]/20'
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                {verificationStatus === 'verified' ? (
                  <CheckCircle className={cn(
                    "w-6 h-6",
                    theme === 'dark' ? 'text-[#10B981]' : 'text-[#10B981]'
                  )} />
                ) : (
                  <XCircle className={cn(
                    "w-6 h-6",
                    theme === 'dark' ? 'text-[#EF4444]' : 'text-[#EF4444]'
                  )} />
                )}
                
                <h3 className={cn(
                  "font-semibold",
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {verificationStatus === 'verified'
                    ? 'Certificate Verified Successfully'
                    : 'Invalid Certificate ID'
                  }
                </h3>
              </div>
              
              {verificationStatus === 'verified' && certificateData && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {[
                      { label: "Certificate ID", value: certificateData.id },
                      { label: "Student Name", value: certificateData.studentName },
                      { label: "Course", value: certificateData.courseName },
                      { label: "Completion Date", value: certificateData.completionDate },
                      { label: "Issued By", value: certificateData.issuedBy },
                      { label: "Grade", value: certificateData.grade }
                    ].map((item, index) => (
                      <div key={index}>
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
                    ))}
                  </div>
                  
                  <Button
                    onClick={viewCertificateDetails}
                    className="w-full bg-[#6938EF] hover:bg-[#5B2FD1] text-white flex items-center gap-2"
                  >
                    View Full Certificate
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {verificationStatus === 'invalid' && (
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                )}>
                  The certificate ID you entered could not be found in our database. Please check the ID and try again, or contact support if you believe this is an error.
                </p>
              )}
            </motion.div>
          )}
        </div>
        
        {/* How Verification Works */}
        <div className={cn(
          "p-6 rounded-xl border",
          theme === 'dark'
            ? 'bg-[#110C1D] border-[#6938EF]/30'
            : 'bg-white border-[#6938EF]/20'
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-4",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            How Certificate Verification Works
          </h3>
          
          <div className="space-y-4">
            {[
              {
                icon: <FileCheck className="w-5 h-5" />,
                title: "Unique Certificate ID",
                description: "Each certificate issued by EduAI has a unique ID that can be used to verify its authenticity."
              },
              {
                icon: <Search className="w-5 h-5" />,
                title: "Verification Process",
                description: "Enter the certificate ID in the verification tool above. Our system will check if the certificate exists in our database."
              },
              {
                icon: <User className="w-5 h-5" />,
                title: "Student Information",
                description: "If verified, you can view the student's name, course details, and completion date to confirm the certificate's authenticity."
              },
              {
                icon: <Calendar className="w-5 h-5" />,
                title: "Validity Period",
                description: "Most EduAI certificates are valid for a lifetime, but some specialized certifications may have an expiration date."
              }
            ].map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  theme === 'dark' ? 'bg-[#1A1425]' : 'bg-[#F9F5FF]'
                )}>
                  {React.cloneElement(item.icon, { 
                    className: `w-5 h-5 ${theme === 'dark' ? 'text-[#9D7BFF]' : 'text-[#6938EF]'}` 
                  })}
                </div>
                
                <div>
                  <h4 className={cn(
                    "font-medium text-sm",
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {item.title}
                  </h4>
                  <p className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  )}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerify;