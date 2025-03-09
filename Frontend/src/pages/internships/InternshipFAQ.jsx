import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQHeader = ({ title = "Frequently Asked Questions", subtitle = "Everything you need to know about internships" }) => {
  const { theme } = useTheme();
  
  return (
    <div className="text-center mb-12 sm:mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6938EF]/10 text-[#6938EF] mb-6 sm:mb-8">
        <HelpCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Got Questions?</span>
      </div>
      <h2 className={cn(
        "text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6",
        theme === 'dark' ? 'text-white' : 'text-foreground'
      )}>
        {title}
      </h2>
      <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

const AccordionItem = ({ question = "Default Question", answer = "Default answer text goes here" }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={false}
      className={cn(
        "border rounded-xl overflow-hidden transition-all duration-300",
        isExpanded 
          ? theme === 'dark' 
            ? 'bg-[#6938EF]/5 border-[#6938EF]' 
            : 'bg-[#6938EF]/5 border-[#6938EF]'
          : theme === 'dark'
            ? 'bg-[#110C1D] border-[#6938EF]/20 hover:border-[#6938EF]/40'
            : 'bg-card border-border hover:border-[#6938EF]/40'
      )}
    >
      <button
        className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className={cn(
          "text-left text-base sm:text-lg font-medium transition-colors duration-300",
          isExpanded 
            ? "text-[#6938EF]"
            : theme === 'dark' ? 'text-white' : 'text-foreground'
        )}>
          {question}
        </h3>
        <ChevronDown 
          className={cn(
            "w-5 h-5 flex-shrink-0 transition-transform duration-300",
            isExpanded 
              ? "transform rotate-180 text-[#6938EF]" 
              : "text-muted-foreground"
          )} 
        />
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 sm:px-6 pb-4">
              <p className="text-sm sm:text-base text-muted-foreground">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InternshipFAQ = () => {
  const faqs = [
    {
      question: "What kind of internships are available?",
      answer: "We offer a variety of internships across different fields including technology, marketing, and design."
    },
    {
      question: "How can I apply for an internship?",
      answer: "To apply for an internship, browse through the available internships, choose the one that interests you, and click on the 'Apply Now' button to begin the application process."
    },
    {
      question: "What happens after I submit my application?",
      answer: "After submitting your application, it will be reviewed by our team. If selected, you will be notified about the next steps. You can track the status of your application through your dashboard."
    },
    {
      question: "Can I apply for multiple internships?",
      answer: "Yes, you can apply for multiple internships based on your interests and qualifications. Each application will be reviewed separately."
    },
    {
      question: "Are these internships paid?",
      answer: "Some internships offer stipends or compensation, while others may be unpaid but provide valuable learning experiences. Details about compensation will be mentioned in the internship descriptions."
    },
    {
      question: "How long do the internships last?",
      answer: "The duration of internships varies depending on the program. Internships can range from a few weeks to several months. The specific duration will be specified in each internship listing."
    }
  ];

  return (
    <div className="py-12 sm:py-16">
      <FAQHeader />
      <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </div>
  );
};

export default InternshipFAQ;

