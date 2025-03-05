import React, { useState } from 'react';
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
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

const ManageCourses = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for courses
  const courses = [
    {
      id: 1,
      title: "Advanced Web Development",
      topic: "Web Development",
      duration: "2 hours",
      students: 1234,
      rating: 4.8,
      status: "Published",
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      title: "Digital Marketing Fundamentals",
      topic: "Marketing",
      duration: "1.5 hours",
      students: 892,
      rating: 4.5,
      status: "Draft",
      lastUpdated: "2024-01-10"
    }
  ];

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
                "text-2xl font-bold",
                theme === 'dark' ? 'text-white' : 'text-foreground'
              )}>
                Manage Courses
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={cn(
                  "border-b",
                  theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                )}>
                  <tr>
                    <th className="text-left p-4 text-sm font-medium">Course</th>
                    <th className="text-left p-4 text-sm font-medium">Topic</th>
                    <th className="text-left p-4 text-sm font-medium">Duration</th>
                    <th className="text-left p-4 text-sm font-medium">Students</th>
                    <th className="text-left p-4 text-sm font-medium">Rating</th>
                    <th className="text-left p-4 text-sm font-medium">Status</th>
                    <th className="text-left p-4 text-sm font-medium">Last Updated</th>
                    <th className="text-right p-4 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {courses.map((course) => (
                    <tr key={course.id} className={cn(
                      "group",
                      theme === 'dark' ? 'hover:bg-[#1A1425]' : 'hover:bg-accent/50'
                    )}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                            theme === 'dark' ? 'bg-[#1A1425]' : 'bg-accent'
                          )}>
                            <BookOpen className="h-5 w-5 text-[#6938EF]" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{course.title}</h3>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{course.topic}</td>
                      <td className="p-4 text-sm">{course.duration}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {course.students}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          {course.rating}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className={cn(
                          "font-normal",
                          getStatusColor(course.status)
                        )}>
                          {course.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {course.lastUpdated}
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
                            <DropdownMenuItem className="gap-2">
                              <Eye className="h-4 w-4" /> View Course
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="h-4 w-4" /> Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-red-500 focus:text-red-500">
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageCourses;