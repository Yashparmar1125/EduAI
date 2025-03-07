import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import {
  ChevronLeft,
  Video,
  BookOpen,
  Target,
  Settings,
  Edit,
  Users,
  DollarSign,
  ListChecks,
  Trash2,
  ExternalLink,
  BarChart
} from 'lucide-react';
import { useToast } from '../../components/ui/toast';
import { getCourseDetails, getCourseStats, deleteCourse } from '../../api/axios.api';

const CourseDetails = () => {
  const { courseId } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useSelector(state => state.auth.user);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    completionRate: 0,
    averageRating: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const  data  = await getCourseDetails(courseId);
      setCourse(data.course);
      // Fetch course statistics
      const statsData = await getCourseStats(courseId);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
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
      navigate('/instructor/courses');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="animate-spin">
          <BarChart className="w-8 h-8 text-[#6938EF]" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <button
            onClick={() => navigate('/instructor/courses')}
            className="text-[#6938EF] hover:underline"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/instructor/courses')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Courses</span>
            </button>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-2">
              Course Management Dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/instructor/courses/${courseId}/edit`)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl",
                "bg-[#6938EF] text-white hover:bg-[#5B2FD1] transition-colors duration-200"
              )}
            >
              <Edit className="w-4 h-4" />
              <span>Edit Course</span>
            </button>
            <button
              onClick={handleDelete}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border",
                "text-red-500 hover:bg-red-500/10 transition-colors duration-200",
                theme === 'dark' ? 'border-red-500/20' : 'border-red-500/20'
              )}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Course Preview */}
        <div className={cn(
          "rounded-2xl border mb-8",
          theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
        )}>
          <div className="relative h-48 rounded-t-2xl overflow-hidden">
            {course.poster ? (
              <>
                <img 
                  src={course.poster} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-[#6938EF] to-[#FF8A3D] opacity-80" />
            )}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-xs font-medium",
                    theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
                  )}>
                    {course.category}
                  </span>
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-xs font-medium capitalize",
                    theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
                  )}>
                    {course.level}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white">{course.title}</h1>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-4 gap-6">
              <div className={cn(
                "p-4 rounded-xl border",
                theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
              )}>
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-[#6938EF]" />
                  <h3 className="font-medium">Students</h3>
                </div>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>

              <div className={cn(
                "p-4 rounded-xl border",
                theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
              )}>
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-[#6938EF]" />
                  <h3 className="font-medium">Completion Rate</h3>
                </div>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>

              <div className={cn(
                "p-4 rounded-xl border",
                theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
              )}>
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-[#6938EF]" />
                  <h3 className="font-medium">Revenue</h3>
                </div>
                <p className="text-2xl font-bold">${stats.totalRevenue}</p>
              </div>

              <div className={cn(
                "p-4 rounded-xl border",
                theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
              )}>
                <div className="flex items-center gap-3 mb-2">
                  <BarChart className="w-5 h-5 text-[#6938EF]" />
                  <h3 className="font-medium">Rating</h3>
                </div>
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {/* Description */}
            <div className={cn(
              "p-6 rounded-xl border",
              theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
            )}>
              <h2 className="text-xl font-semibold mb-4">About this course</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{course.description}</p>
            </div>

            {/* Modules */}
            <div className={cn(
              "p-6 rounded-xl border",
              theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
            )}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Course Content</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#6938EF]" />
                    <span>{course.modules.length} Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-[#6938EF]" />
                    <span>
                      {course.modules.reduce((acc, module) => acc + (module.quiz?.length || 0), 0)} Quizzes
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-xl border",
                      theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          theme === 'dark' ? 'bg-[#6938EF]/20' : 'bg-accent'
                        )}>
                          <span className="text-sm font-medium text-[#6938EF]">{index + 1}</span>
                        </div>
                        <h3 className="font-medium">{module.title}</h3>
                      </div>
                      {module.videoUrl && (
                        <a
                          href={module.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-[#6938EF] hover:underline"
                        >
                          <Video className="w-4 h-4" />
                          <span>View Video</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <p className="text-muted-foreground mb-4">{module.content}</p>

                    {module.quiz && module.quiz.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Quiz Questions</h4>
                        <div className="space-y-2">
                          {module.quiz.map((quiz, qIndex) => (
                            <div
                              key={qIndex}
                              className={cn(
                                "p-3 rounded-lg",
                                theme === 'dark' ? 'bg-[#1A1625]' : 'bg-accent/50'
                              )}
                            >
                              <p className="font-medium mb-2">Q{qIndex + 1}: {quiz.question}</p>
                              <div className="pl-4 space-y-1">
                                {quiz.options.map((option, oIndex) => (
                                  <div
                                    key={oIndex}
                                    className={cn(
                                      "text-sm",
                                      option === quiz.correctAnswer && "text-green-500"
                                    )}
                                  >
                                    {String.fromCharCode(65 + oIndex)}. {option}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className={cn(
              "p-6 rounded-xl border",
              theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
            )}>
              <h3 className="font-medium mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/instructor/courses/${courseId}/analytics`)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                    "hover:bg-accent/50 transition-colors duration-200"
                  )}
                >
                  <BarChart className="w-5 h-5 text-[#6938EF]" />
                  <span>View Analytics</span>
                </button>
                <button
                  onClick={() => navigate(`/instructor/courses/${courseId}/students`)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                    "hover:bg-accent/50 transition-colors duration-200"
                  )}
                >
                  <Users className="w-5 h-5 text-[#6938EF]" />
                  <span>Manage Students</span>
                </button>
                <button
                  onClick={() => navigate(`/instructor/courses/${courseId}/settings`)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                    "hover:bg-accent/50 transition-colors duration-200"
                  )}
                >
                  <Settings className="w-5 h-5 text-[#6938EF]" />
                  <span>Course Settings</span>
                </button>
              </div>
            </div>

            {/* Course Info */}
            <div className={cn(
              "p-6 rounded-xl border",
              theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
            )}>
              <h3 className="font-medium mb-4">Course Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">${course.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{course.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-medium capitalize">{course.level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created On</p>
                  <p className="font-medium">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails; 