import { Link } from "react-router-dom"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { GraduationCap, Menu, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

export function Navbar() {
  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/community", label: "Community" },
    { path: "/internships", label: "Internships" },
    { path: "/dashboard", label: "Dashboard" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-8 flex h-16 items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-6 w-6 text-primary" />
          <Link to="/" className="text-xl font-bold">
            EduAI
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center justify-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/community" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Community
          </Link>
          <Link to="/internships" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Internships
          </Link>
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Dashboard
          </Link>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
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
                          className="flex w-full items-center py-3 text-sm font-medium transition-colors hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
                <div className="p-6 border-t">
                  <div className="flex flex-col space-y-3">
                    <SheetClose asChild>
                      <Button variant="ghost" className="w-full justify-center">
                        Sign In
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button className="w-full justify-center">
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
  )
}