import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { Star, Users, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { getRecommendedCourses } from "@/api/axios.api";
import { toast } from 'react-hot-toast';

const Recommends = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendedCourses();
        // The response is already processed by axios interceptor
        setCourses(data.recommendations || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        toast.error(error.message || 'Failed to fetch course recommendations');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleStartLearning = (e, courseId) => {
    e.preventDefault(); // Prevent Link navigation
    navigate(`/dashboard/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6938EF]" />
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="text-center py-12">
        <h2 className={cn(
          "text-lg font-semibold mb-2",
          theme === 'dark' ? 'text-white' : 'text-foreground'
        )}>
          No Recommendations Yet
        </h2>
        <p className="text-muted-foreground">
          Complete more courses and assessments to get personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h2 align="center" className={cn(
        "text-lg font-semibold py-8 mb-4",
        theme === 'dark' ? 'text-white' : 'text-foreground'
      )}>
        Recommended Courses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Link to={`/course/${course.id}`} key={course.id}>
            <Motion.div
              whileHover={{ scale: 1.02 }}
              className={cn(
                "rounded-xl border overflow-hidden",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={course.image || '/placeholder-course.jpg'}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className={cn(
                  "absolute top-2 right-2 px-2 py-1 rounded-full text-xs",
                  theme === 'dark' ? 'bg-[#110C1D]/90' : 'bg-white/90'
                )}>
                  {course.level}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-[#6938EF] text-[#6938EF]" />
                    <span className="text-sm ml-1">{course.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground ml-1">{course.duration}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground ml-1">{course.studentsCount}</span>
                  </div>
                </div>

                <h3 className={cn(
                  "font-semibold mb-1",
                  theme === 'dark' ? 'text-white' : 'text-foreground'
                )}>
                  {course.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {course.description}
                </p>

                <p className="text-sm text-muted-foreground mb-4">
                  By {course.instructor}
                </p>

                <Button 
                  className="w-full bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
                  onClick={(e) => handleStartLearning(e, course.id)}
                >
                  {course.price > 0 ? `Enroll for $${course.price}` : 'Start Learning'}
                </Button>
              </div>
            </Motion.div>
          </Link>
        ))}
      </div>
    </Motion.div>
  );
};

export default Recommends;