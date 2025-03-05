import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { GraduationCap, Menu, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux"; // Add useDispatch
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
import { useNavigate } from "react-router-dom";
import { signOut as firebaseSignOut, getAuth } from "firebase/auth"; // Import Firebase's signOut

// Your action to update Redux auth state (reset user)
import { logout } from "../redux/slices/authSlice"; // Adjust import path as necessary

export function Navbar({ openModal, openLoginModal }) {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch
  const authState = useSelector((state) => state.auth);
  const user = authState.userData;

  // Sign out function
  const handleSignOut = async () => {
    try {
      // Call the API to log out the user
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Remove JWT token from localStorage (or sessionStorage)
        localStorage.removeItem("auth_token");
        
        // Dispatch the logout action to reset the Redux state
        dispatch(logout());

        // Redirect the user to homepage or login page after sign out
        navigate("/"); // or navigate("/"); depending on your flow
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };


  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/community", label: "Community" },
    { path: "/internships", label: "Internships" },
    { path: "/dashboard", label: "Dashboard" },
  ];

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
          <DropdownMenuItem>
            <Link to="/profile" className="w-full">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/settings" className="w-full">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 dark:text-red-400"
            onClick={handleSignOut} // Call the sign out function
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
            >
              Sign In
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              className="w-full justify-center bg-[#6938EF] dark:bg-[#9D7BFF] text-white hover:bg-[#5B2FD1] dark:hover:bg-[#8B63FF]"
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
            <AvatarImage src={user.avatar} />
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
          <Button
            variant="ghost"
            className="w-full justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleSignOut} // Call the sign out function
          >
            Sign Out
          </Button>
        </SheetClose>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-purple-100 dark:border-purple-900/40 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-8 flex h-16 items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-6 w-6 text-[#6938EF] dark:text-[#9D7BFF]" />
          <Link to="/" className="text-xl font-bold text-[#6938EF] dark:text-[#9D7BFF]">
            EduAI
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center justify-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-[#6938EF] dark:hover:text-[#9D7BFF]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center space-x-3">
            <UserActions />
          </div>

          {/* Mobile Menu */}
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
              <div className="flex flex-col h-full">
                <div className="flex-1 px-6">
                  <div className="mt-6 space-y-1">
                    {menuItems.map((item) => (
                      <SheetClose asChild key={item.path}>
                        <Link
                          to={item.path}
                          className="flex w-full items-center py-3 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-[#6938EF] dark:hover:text-[#9D7BFF] hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
                <div className="p-6 border-t border-purple-100 dark:border-purple-900/40">
                  <div className="flex flex-col space-y-3">
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-center text-gray-600 dark:text-gray-300 hover:text-[#6938EF] dark:hover:text-[#9D7BFF] hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      >
                        Sign In
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button className="w-full justify-center bg-[#6938EF] dark:bg-[#9D7BFF] text-white hover:bg-[#5B2FD1] dark:hover:bg-[#8B63FF]">
                        Get Started
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
