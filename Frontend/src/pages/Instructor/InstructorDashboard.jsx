import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { useToast } from "../../components/ui/toast";
import {
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  Plus,
  Bell,
  Search,
  BarChart2,
  Calendar,
  MessageSquare,
  Settings,
  ChevronRight,
  ClipboardList,
  Layout,
  Loader2
} from 'lucide-react';
import { getInstructorStats } from '../../api/axios.api';

const StatCard = ({ icon: Icon, label, value, trend, trendValue }) => {
  const { theme } = useTheme();
  return (
    <div className={cn(
      "p-6 rounded-2xl border",
      theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          theme === 'dark' ? 'bg-[#1A1425]' : 'bg-accent/50'
        )}>
          <Icon className="w-5 h-5 text-[#6938EF]" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <TrendingUp className={cn(
            "w-4 h-4",
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          )} />
          <span className={cn(
            "text-sm font-medium",
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          )}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
};

const CourseCard = ({ _id, title, studentsCount, poster, status }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  return (
    <div className={cn(
      "p-6 rounded-2xl border group hover:border-[#6938EF]/40 transition-all duration-200",
      theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
    )}>
      <div className="space-y-4">
        <div className="aspect-video relative rounded-xl overflow-hidden">
          <img 
            src={poster} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-3 right-3">
            <span className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full",
             'bg-green-500/10 text-green-500'
            )}>
              publis
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{studentsCount} Students</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/instructor/courses/${_id}/edit`)}
              className="text-sm font-medium text-[#6938EF] hover:underline"
            >
              Edit Course
            </button>
            <button 
              onClick={() => navigate(`/instructor/courses/${_id}`)}
              className="text-sm font-medium text-[#6938EF] hover:underline"
            >
              View Details
            </button>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

const AssessmentsTab = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  

  const assessments = [
    {
      title: "Full Stack Development Skills",
      field: "Web Development",
      skillsAssessed: [
        "Frontend Frameworks",
        "Backend Architecture",
        "Database Design",
        "API Development"
      ],
      difficulty: "Advanced",
      duration: "120 mins",
      totalAttempts: 234,
      avgSkillGap: "Intermediate to Advanced",
      topGaps: ["System Design", "Security Best Practices"]
    },
    {
      title: "Digital Marketing Proficiency",
      field: "Marketing",
      skillsAssessed: [
        "SEO",
        "Content Strategy",
        "Social Media",
        "Analytics"
      ],
      difficulty: "Intermediate",
      duration: "90 mins",
      totalAttempts: 892,
      avgSkillGap: "Beginner to Intermediate",
      topGaps: ["Marketing Automation", "Data Analysis"]
    },
    {
      title: "UI/UX Design Assessment",
      field: "Design",
      skillsAssessed: [
        "User Research",
        "Wireframing",
        "Prototyping",
        "Design Systems"
      ],
      difficulty: "Intermediate",
      duration: "100 mins",
      totalAttempts: 567,
      avgSkillGap: "Intermediate",
      topGaps: ["Design Psychology", "Accessibility"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Skill Gap Assessments</h2>
          <p className="text-sm text-muted-foreground mt-1">Create and manage skill assessments for different domains</p>
        </div>
        <button className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl",
          "bg-[#6938EF] text-white hover:bg-[#5B2FD1] transition-colors duration-200"
        )} onClick={() => navigate('/instructor/assessments/create')}>
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Create Assessment</span>
        </button>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-2xl border hover:border-[#6938EF]/40 transition-all duration-200",
              theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{assessment.title}</h3>
                <p className="text-sm text-muted-foreground">{assessment.field}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full",
                  "bg-[#6938EF]/10 text-[#6938EF]"
                )}>
                  {assessment.difficulty}
                </div>
                <div className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full",
                  "bg-accent text-muted-foreground"
                )}>
                  {assessment.duration}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium mb-2">Skills Assessed</p>
                <div className="flex flex-wrap gap-2">
                  {assessment.skillsAssessed.map((skill, i) => (
                    <span
                      key={i}
                      className={cn(
                        "px-2 py-1 text-xs rounded-lg",
                        theme === 'dark' ? 'bg-[#1A1425]' : 'bg-accent/50'
                      )}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Top Skill Gaps Identified</p>
                <div className="flex flex-wrap gap-2">
                  {assessment.topGaps.map((gap, i) => (
                    <span
                      key={i}
                      className={cn(
                        "px-2 py-1 text-xs rounded-lg",
                        "bg-yellow-500/10 text-yellow-500"
                      )}
                    >
                      {gap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Total Attempts:</span>{' '}
                  <span className="font-medium">{assessment.totalAttempts}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Average Skill Gap:</span>{' '}
                  <span className="font-medium">{assessment.avgSkillGap}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-sm font-medium text-[#6938EF] hover:underline">View Details</button>
                <button className="text-sm font-medium text-[#6938EF] hover:underline">Edit Assessment</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InstructorDashboard = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('courses');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    totalRevenue: 0,
    averageRating: 0,
    recentCourses: []
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await getInstructorStats(); 
      
      if (response.success===true) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#6938EF]" />
          <span className="text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Instructor Dashboard - Course Management</title>
        <meta
          name="description"
          content="Manage your courses, track student progress, and grow your teaching business with our comprehensive instructor dashboard."
        />
      </Helmet>

      <div className="min-h-screen bg-background flex">
            <div className="flex-1">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, Instructor!</h1>
                <p className="text-muted-foreground">Here's what's happening with your courses today.</p>
              </div>
              <div className="flex items-center gap-4">
                <button className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl border",
                  "hover:bg-accent/50 transition-colors duration-200",
                  theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                )}>
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-medium">Notifications</span>
                </button>
                <button className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl",
                  "bg-[#6938EF] text-white hover:bg-[#5B2FD1] transition-colors duration-200"
                )} onClick={() => navigate('/instructor/courses/create')}>
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Create Course</span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                icon={Users}
                label="Total Students"
                value={stats.totalStudents}
                trend="up"
                trendValue="+12.5% this month"
              />
              <StatCard 
                icon={BookOpen}
                label="Active Courses"
                value={stats.activeCourses}
                trend="up"
                trendValue="+2 new courses"
              />
              <StatCard 
                icon={BarChart2}
                label="Total Revenue"
                value={`$${stats.totalRevenue}`}
                trend="up"
                trendValue="+8.3% this month"
              />
              <StatCard 
                icon={MessageSquare}
                label="Average Rating"
                value={`${stats.averageRating}/5.0`}
                trend="up"
                trendValue="+24 new reviews"
              />
            </div>

            {/* Main Content */}
            {activeTab === 'courses' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Courses</h2>
                  <Link 
                    to="/instructor/courses" 
                    className="text-sm text-[#6938EF] hover:underline"
                  >
                    View all courses
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.recentCourses.map((course) => (
                    <CourseCard 
                      key={course._id}
                      {...course}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <AssessmentsTab />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorDashboard;