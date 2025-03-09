import React, { useState, useEffect } from 'react';
import { useTheme } from "../../components/theme-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Users,
  Star,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Badge
} from "@/components/ui/badge";
import { useToast } from "../../components/ui/toast";
import { getInstructorCourses ,deleteCourse} from "../../api/axios.api";

const ManageCourses = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter courses based on search query
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const fetchCourses = async () => {
    try {
      const response = await getInstructorCourses();
      setCourses(response.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteCourse(courseId);
      toast({
        title: "Success",
        description: "Course deleted successfully",
        variant: "success",
      });
      // Refresh courses list
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-500/10 text-green-500';
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#6938EF]" />
          <span className="text-muted-foreground">Loading courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen p-4 sm:p-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className={cn(
                "text-2xl font-bold pl-11",
                theme === 'dark' ? 'text-white' : 'text-foreground'
              )}>
                Manage Courses
              </h1>
              <p className="text-sm text-muted-foreground mt-1 pl-0">
                Create, edit and manage your course content
              </p>
            </div>
            <Link to="/instructor/courses/create">
              <Button
                className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </Link>
          </div>

          {/* Filters and Search */}
          <div className={cn(
            "rounded-xl border shadow-sm p-4 mb-6",
            theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
          )}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "pl-9",
                    theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/20' : 'bg-background'
                  )}
                />
              </div>
              <Button
                variant="outline"
                className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Courses List */}
          <div className={cn(
            "rounded-xl border shadow-sm overflow-hidden",
            theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
          )}>
            {filteredCourses.length === 0 ? (
              <div className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No courses found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search query" : "Start by creating your first course"}
                </p>
                {!searchQuery && (
                  <Link to="/instructor/courses/create">
                    <Button
                      className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Course
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={cn(
                    "border-b",
                    theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                  )}>
                    <tr>
                      <th className="text-left p-4 text-sm font-medium">Course</th>
                      <th className="text-left p-4 text-sm font-medium">Category</th>
                      <th className="text-left p-4 text-sm font-medium">Level</th>
                      <th className="text-left p-4 text-sm font-medium">Students</th>
                      <th className="text-left p-4 text-sm font-medium">Price</th>
                      <th className="text-left p-4 text-sm font-medium">Status</th>
                      <th className="text-left p-4 text-sm font-medium">Created</th>
                      <th className="text-right p-4 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredCourses.map((course) => (
                      <tr key={course._id} className={cn(
                        "group",
                        theme === 'dark' ? 'hover:bg-[#1A1425]' : 'hover:bg-accent/50'
                      )}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                              theme === 'dark' ? 'bg-[#1A1425]' : 'bg-accent'
                            )}>
                              {course.poster ? (
                                <img 
                                  src={course.poster} 
                                  alt={course.title}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <BookOpen className="h-5 w-5 text-[#6938EF]" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">{course.title}</h3>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm capitalize">{course.category}</td>
                        <td className="p-4 text-sm capitalize">{course.level}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {course.studentsEnrolled?.length || 0}
                          </div>
                        </td>
                        <td className="p-4 text-sm">${course.price}</td>
                        <td className="p-4">
                          <Badge variant="secondary" className={cn(
                            "font-normal",
                            getStatusColor(course.status || 'published')
                          )}>
                            {course.status || 'published'}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-[#6938EF]/10"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className={
                              theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : ''
                            }>
                              <DropdownMenuItem 
                                className="gap-2"
                                onClick={() => navigate(`/instructor/courses/${course._id}`)}
                              >
                                <Eye className="h-4 w-4" /> View Course
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2"
                                onClick={() => navigate(`/instructor/courses/${course._id}/edit`)}
                              >
                                <Edit className="h-4 w-4" /> Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2 text-red-500 focus:text-red-500"
                                onClick={() => handleDeleteCourse(course._id)}
                              >
                                <Trash2 className="h-4 w-4" /> Delete Course
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageCourses;