import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { Quote } from 'lucide-react';

const TestimonialCard = ({ imageUrl, text, name, title }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "w-[300px] rounded-2xl border p-6 group",
        "transition-all duration-300 ease-in-out",
        theme === 'dark' 
          ? 'bg-[#110C1D] border-[#6938EF]/20 hover:bg-[#6938EF] hover:border-[#6938EF]' 
          : 'bg-card border-border hover:bg-[#6938EF] hover:border-[#6938EF]'
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#6938EF]/20 group-hover:ring-white/20 transition-all duration-300">
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className={cn(
            "absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            theme === 'dark' 
              ? 'bg-[#6938EF] group-hover:bg-white' 
              : 'bg-[#6938EF] group-hover:bg-white'
          )}>
            <Quote className="w-4 h-4 text-white group-hover:text-[#6938EF] transition-colors duration-300" />
          </div>
        </div>
        
        <p className={cn(
          "mb-6 text-base leading-relaxed transition-colors duration-300",
          theme === 'dark'
            ? 'text-muted-foreground group-hover:text-white'
            : 'text-muted-foreground group-hover:text-white'
        )}>
          {text}
        </p>
        
        <h3 className={cn(
          "text-lg font-semibold mb-1 transition-colors duration-300",
          theme === 'dark'
            ? 'text-white group-hover:text-white'
            : 'text-foreground group-hover:text-white'
        )}>
          {name}
        </h3>
        
        <p className={cn(
          "text-sm transition-colors duration-300",
          theme === 'dark'
            ? 'text-muted-foreground group-hover:text-white/80'
            : 'text-muted-foreground group-hover:text-white/80'
        )}>
          {title}
        </p>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const { theme } = useTheme();
  const testimonials = [
    {
      imageUrl: "https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img.png",
      text: "This platform offers great internships and structured roadmaps, helping me gain experience and grow my career.",
      name: "Emily Roberts",
      title: "Cyber Security Engineer"
    },
    {
      imageUrl: "https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img-2.png",
      text: "As a professor, this platform has been an invaluable resource. It has enhanced my knowledge & my teaching methods in ways.",
      name: "Prof. Jeo Denmark",
      title: "Software Engineer"
    },
    {
      imageUrl: "https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img-3.png",
      text: "This platform has significantly boosted my career. The resources and opportunities have helped me grow professionally.",
      name: "Kevin Joseph",
      title: "Data Scientist"
    },
    {
      imageUrl: "https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img-4.png",
      text: "This platform has significantly boosted my career. The resources and opportunities have helped me grow professionally.",
      name: "Monica Gartner",
      title: "Graphics Engineer"
    }
  ];

  return (
    <div className={cn(
      "w-full py-20 px-4 sm:px-6 lg:px-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className={cn(
            "text-4xl sm:text-5xl font-bold mb-6",
            theme === 'dark' ? 'text-white' : 'text-foreground'
          )}>
            What Our Students Say
          </h1>
          <p className={cn(
            "text-xl max-w-3xl mx-auto",
            theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'
          )}>
            Hear from our community of learners about their experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

