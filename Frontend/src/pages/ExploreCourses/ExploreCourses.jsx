import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  Filter,
  BookOpen,
  Star,
  User,
  Clock,
  ChevronDown,
  ArrowRight,
  Frown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCourses } from '../../api/axios.api';
import { Skeleton } from "../../components/ui/skeleton";

const CourseCardSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <div className={cn(
      "rounded-xl border shadow-sm overflow-hidden",
      theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
    )}>
      <Skeleton className="aspect-video w-full" />
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
};

const ExploreCourses = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Mock categories and levels for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'programming', name: 'Programming' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'marketing', name: 'Marketing' },
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const filters = {
          search: searchQuery,
          category: selectedCategory,
          level: selectedLevel
        };
        const response = await getAllCourses(filters);
        setCourses(response.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Add debounce for search
    const debounceTimer = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory, selectedLevel]);

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (error) {
    return (
      <div className={cn(
        "min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex items-center justify-center",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}>
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)] p-4 sm:p-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className={cn(
            "text-3xl font-bold mb-2",
            theme === 'dark' ? 'text-white' : 'text-foreground'
          )}>
            Explore Courses
          </h1>
          <p className="text-muted-foreground">
            Discover courses that match your interests and learning goals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="md:col-span-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            // Show skeleton loading state
            Array(6).fill(null).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))
          ) : filteredCourses.length === 0 ? (
            // Show empty state
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <Frown className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Courses Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                We couldn't find any courses matching your criteria. Try adjusting your filters or search term.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                }}
                variant="outline"
                className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            // Show courses
            filteredCourses.map((course) => (
              <Motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "rounded-xl border shadow-sm overflow-hidden cursor-pointer transition-all",
                  theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border',
                  'hover:shadow-md'
                )}
                onClick={() => navigate(`/dashboard/course/${course.id}`)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={course.poster} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={cn(
                    "absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium",
                    course.level === 'beginner' ? 'bg-green-500/10 text-green-500' :
                    course.level === 'intermediate' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-500'
                  )}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#6938EF] text-[#6938EF]" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{course.studentsCount.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-[#6938EF]">
                      ${course.price}
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreCourses; 