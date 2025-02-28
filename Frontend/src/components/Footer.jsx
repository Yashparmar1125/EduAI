import { Link } from "react-router-dom"
import { GraduationCap, Twitter, Linkedin, Github, Youtube } from "lucide-react"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">EduAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering the next generation of learners through AI-powered learning
            </p>
          </div>

          {/* Learn Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Learn</h3>
            <div className="grid gap-2">
              <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Courses
              </Link>
              <Link to="/career-paths" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Career Paths
              </Link>
              <Link to="/skill-assessment" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Skill Assessment
              </Link>
              <Link to="/enterprise" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Enterprise
              </Link>
            </div>
          </div>

          {/* Community Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Community</h3>
            <div className="grid gap-2">
              <Link to="/forums" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Forums
              </Link>
              <Link to="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Events
              </Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <Link to="/membership" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Membership
              </Link>
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <Button className="w-full" variant="secondary">
              Download App
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          © {currentYear} EduAI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}