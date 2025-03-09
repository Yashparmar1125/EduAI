import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { MapPin, Clock, Code, IndianRupee, ArrowUpRight, Building2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const InternshipCard = ({
  title = "Machine Learning Intern",
  company = "Samsun Pvt Ltd.",
  location = "Mysuru, Shimoga, Gargoti, Colva, Chikmagalur",
  salary = "10,000 /month",
  duration = "6 Months",
  skills = "Python, Open CV, Django, docker, kubernetes",
  companyLogo = "https://dashboard.codeparrot.ai/api/image/Z8WX91j1kitRpYXf/rectangl.png"
}) => {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative w-full rounded-xl border p-5 transition-all duration-300",
        theme === 'dark' 
          ? 'bg-[#110C1D] border-[#6938EF]/20 hover:border-[#6938EF] hover:shadow-lg hover:shadow-[#6938EF]/10' 
          : 'bg-card border-border hover:border-[#6938EF] hover:shadow-lg hover:shadow-[#6938EF]/5'
      )}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6938EF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative">
        {/* Company Details */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "w-8 h-8 rounded-lg overflow-hidden ring-2 transition-all duration-300",
                theme === 'dark' 
                  ? 'ring-[#6938EF]/20 group-hover:ring-[#6938EF]' 
                  : 'ring-[#6938EF]/20 group-hover:ring-[#6938EF]'
              )}>
                <img 
                  src={companyLogo} 
                  alt={company} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {company}
              </span>
            </div>
            <h3 className={cn(
              "text-lg font-semibold group-hover:text-[#6938EF] transition-colors duration-300",
              theme === 'dark' ? 'text-white' : 'text-foreground'
            )}>
              {title}
            </h3>
          </div>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100",
            theme === 'dark' 
              ? 'bg-[#6938EF] text-white' 
              : 'bg-[#6938EF] text-white'
          )}>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={cn(
            "p-3 rounded-lg transition-all duration-300",
            theme === 'dark' 
              ? 'bg-white/5 group-hover:bg-[#6938EF]/10' 
              : 'bg-[#6938EF]/5'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-[#6938EF]" />
              <span className="text-xs font-medium text-[#6938EF]">Location</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{location}</p>
          </div>

          <div className={cn(
            "p-3 rounded-lg transition-all duration-300",
            theme === 'dark' 
              ? 'bg-white/5 group-hover:bg-[#6938EF]/10' 
              : 'bg-[#6938EF]/5'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee className="w-4 h-4 text-[#6938EF]" />
              <span className="text-xs font-medium text-[#6938EF]">Stipend</span>
            </div>
            <p className="text-xs text-muted-foreground">₹ {salary}</p>
          </div>

          <div className={cn(
            "p-3 rounded-lg transition-all duration-300",
            theme === 'dark' 
              ? 'bg-white/5 group-hover:bg-[#6938EF]/10' 
              : 'bg-[#6938EF]/5'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-[#6938EF]" />
              <span className="text-xs font-medium text-[#6938EF]">Duration</span>
            </div>
            <p className="text-xs text-muted-foreground">{duration}</p>
          </div>

          <div className={cn(
            "p-3 rounded-lg transition-all duration-300",
            theme === 'dark' 
              ? 'bg-white/5 group-hover:bg-[#6938EF]/10' 
              : 'bg-[#6938EF]/5'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Code className="w-4 h-4 text-[#6938EF]" />
              <span className="text-xs font-medium text-[#6938EF]">Skills</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{skills}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <span className={cn(
            "px-3 py-1 text-xs font-medium rounded-full transition-all duration-300",
            theme === 'dark' 
              ? 'bg-[#6938EF]/10 text-[#6938EF] group-hover:bg-[#6938EF] group-hover:text-white' 
              : 'bg-[#6938EF]/10 text-[#6938EF] group-hover:bg-[#6938EF] group-hover:text-white'
          )}>
            Internship
          </span>
          <a
  href="https://internshala.com/internship/detail/work-from-home-part-time-artificial-intelligence-and-machine-learning-content-writing-internship-at-earth5r1741423449"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button
    size="sm"
    className="bg-gradient-to-r from-[#6938EF] to-[#9D7BFF] hover:from-[#5B2FD1] hover:to-[#8B6AE5] text-white shadow-lg shadow-[#6938EF]/25"
  >
    Apply Now
  </Button>
</a>

        </div>
      </div>
    </motion.div>
  );
};

export default InternshipCard;

