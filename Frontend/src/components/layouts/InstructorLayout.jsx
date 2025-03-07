import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cn } from "@/lib/utils";
import { useTheme } from "../theme-provider";
import {
  LayoutGrid,
  BookOpen,
  Users,
  GraduationCap,
  Settings,
  BarChart3,
  ClipboardList
} from 'lucide-react';

const InstructorLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const user = useSelector(state => state.auth.user);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutGrid,
      path: '/instructor/dashboard'
    },
    {
      title: 'My Courses',
      icon: BookOpen,
      path: '/instructor/courses'
    },
    
    {
      title: 'Assessments',
      icon: ClipboardList,
      path: '/instructor/assessments'
    },
    
  ];

  const isActive = (path) => {
    if (path === '/instructor/courses') {
      // Match any course-related paths
      return location.pathname.startsWith('/instructor/courses');
    }
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "w-64 border-r flex-shrink-0 p-6",
        theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
      )}>
        {/* Instructor Profile */}
        <div className="flex items-center gap-3 mb-8">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            "bg-[#6938EF] text-white font-medium text-lg"
          )}>
            {user?.name?.[0]?.toUpperCase() || 'I'}
          </div>
          <div>
            <h3 className="font-medium">{user?.name || 'Admin'}</h3>
            <p className="text-sm text-muted-foreground">Instructor</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 rounded-lg",
                  "transition-colors duration-200",
                  isActive(item.path)
                    ? "bg-[#6938EF] text-white"
                    : "hover:bg-accent/50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Create Course Button */}
        
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default InstructorLayout; 