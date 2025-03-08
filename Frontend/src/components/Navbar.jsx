import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { GraduationCap, Menu, User, LayoutDashboard, BookOpen, FileQuestion, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { resetStore } from "../redux/store/store";
import { cn } from "@/lib/utils";

export function Navbar() {
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.user);
  const user = authState.userData;
  const location = useLocation();
  
  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
      });

      // Clear auth token first
      localStorage.removeItem("auth_token");
      
      // Reset Redux store
      resetStore();

      // Navigate to home page
      navigate("/");

      if (!response.ok) {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during sign-out:", error);
      // Even if there's an error, ensure the local state is cleared
      localStorage.removeItem("auth_token");
      resetStore();
      navigate("/");
    }
  };

  const getMenuItems = () => {
    if (authState.status === false) {
      return [
        { path: "/", label: "Home" },
        { path: "/community", label: "Community" },
        { path: "/internships", label: "Internships" },
      ];
    }
    
    if (role === 'instructor') {
      return [
        { path: "/instructor/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/instructor/courses", label: "Courses", icon: BookOpen },
        { path: "/instructor/assessments", label: "Assessments", icon: FileQuestion }
      ];
    }
    
    return [
      { path: "/", label: "Home" },
      { path: "/community", label: "Community" },
      { path: "/internships", label: "Internships" },
      { path: "/dashboard", label: "Dashboard" },
    ];
  };

  const menuItems = getMenuItems();

  const UserActions = () => {
    if (authState.status === false) {
      return (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-300 hover:text-[#6938EF] dark:hover:text-[#9D7BFF] hover:bg-purple-50 dark:hover:bg-purple-900/20"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
          <Button
            size="sm"
            className="bg-[#6938EF] dark:bg-[#9D7BFF] text-white hover:bg-[#5B2FD1] dark:hover:bg-[#8B63FF] transition-colors"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-purple-100 dark:bg-purple-900/40 text-[#6938EF] dark:text-[#9D7BFF]">
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {user.name}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          
          <DropdownMenuItem
            className="text-red-600 dark:text-red-400 justify-center hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleSignOut}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const MobileUserActions = () => {
    if (authState.status === false) {
      return (
        <div className="flex flex-col space-y-3">
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="w-full justify-center text-gray-600 dark:text-gray-300 hover:text-[#6938EF] dark:hover:text-[#9D7BFF] hover:bg-purple-50 dark:hover:bg-purple-900/20"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              className="w-full justify-center bg-[#6938EF] dark:bg-[#9D7BFF] text-white hover:bg-[#5B2FD1] dark:hover:bg-[#8B63FF]"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
          </SheetClose>
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-3 px-3 py-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="bg-purple-100 dark:bg-purple-900/40 text-[#6938EF] dark:text-[#9D7BFF]">
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        <SheetClose asChild>
          <Link
            to="/profile"
            className="w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#6938EF] dark:hover:text-[#9D7BFF] hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            Profile
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            to="/settings"
            className="w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#6938EF] dark:hover:text-[#9D7BFF] hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            Settings
          </Link>
        </SheetClose>
        <div className="px-3 pt-3 border-t border-purple-100 dark:border-purple-900/40">
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="w-full justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </SheetClose>
        </div>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-purple-100 dark:border-purple-900/40 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-6 w-6 text-[#6938EF] dark:text-[#9D7BFF]" />
          <Link 
            to={role === 'instructor' ? "/instructor/dashboard" : "/"} 
            className="text-xl font-bold text-[#6938EF] dark:text-[#9D7BFF]"
          >
            EduAI
          </Link>
        </div>

        { (
          <div className="hidden md:flex items-center justify-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-[#6938EF] text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-[#6938EF] dark:hover:text-[#9D7BFF] hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  )}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center space-x-3">
            <UserActions />
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-gray-600 dark:text-gray-300 hover:text-[#6938EF] dark:hover:text-[#9D7BFF] hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] sm:w-[400px] p-0 border-purple-100 dark:border-purple-900/40 bg-white dark:bg-gray-900"
            >
              <SheetHeader className="p-6 border-b border-purple-100 dark:border-purple-900/40">
                <SheetTitle className="flex items-center space-x-2 text-[#6938EF] dark:text-[#9D7BFF]">
                  <GraduationCap className="h-6 w-6" />
                  <span>EduAI</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col py-6">
                {authState.status && menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <SheetClose key={item.path} asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 transition-colors duration-200",
                          isActive
                            ? "bg-[#6938EF]/10 text-[#6938EF] dark:text-[#9D7BFF]"
                            : "text-gray-600 dark:text-gray-300 hover:text-[#6938EF] dark:hover:text-[#9D7BFF] hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        )}
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    </SheetClose>
                  );
                })}
                <div className="mt-auto px-6 pt-6 border-t border-purple-100 dark:border-purple-900/40">
                  <MobileUserActions />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
