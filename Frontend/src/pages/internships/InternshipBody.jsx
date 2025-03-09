import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import InternshipCard from './InternshipCard';
import FilterBar from './FilterBar';

const InternshipBody = () => {
  const { theme } = useTheme();

  const sections = [
    {
      title: "Internshala",
      internships: [
        { title: "Machine Learning Intern" },
        { title: "Deep Learning Intern" },
        { title: "AI Tools Intern" },
        { title: "Robotics Intern" }
      ]
    },
    {
      title: "Indeed",
      internships: [
        { title: "Artificial Intelligence Intern" },
        { title: "Electronics Intern" },
        { title: "Frontend Developer Intern" },
        { title: "Backend Developer Intern" }
      ]
    },
    {
      title: "LinkedIn",
      internships: [
        { title: "Full Stack Developer Intern" },
        { title: "Robotics Intern" },
        { title: "Neural Networks Intern" },
        { title: "Machine Learning Intern" }
      ]
    }
  ];

  return (
    <div className="py-8 sm:py-12">
      {/* Filter Section */}
      <div className="mb-16">
        <FilterBar />
      </div>

      {/* Internship Sections */}
      <div className="space-y-16 sm:space-y-20">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h2 className={cn(
              "text-2xl sm:text-3xl font-bold mb-8 sm:mb-10",
              theme === 'dark' ? 'text-white' : 'text-foreground'
            )}>
              {section.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {section.internships.map((internship, i) => (
                <InternshipCard
                  key={i}
                  title={internship.title}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InternshipBody;
