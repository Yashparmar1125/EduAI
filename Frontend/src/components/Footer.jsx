import { Link } from "react-router-dom"
import { GraduationCap, Twitter, Linkedin, Github, Youtube } from "lucide-react"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

export function Footer() {
  return (
    <footer className="w-full border-t border-purple-100 dark:border-purple-900/40 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-[#6938EF] dark:text-[#9D7BFF]" />
              <span className="text-lg font-semibold text-[#6938EF] dark:text-[#9D7BFF]">EduAI</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Empowering the next generation of learners through AI-powered learning
            </p>
          </div>

          {/* Learn Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Learn</h3>
            <div className="grid gap-2">
              {["Courses", "Career Paths", "Skill Assessment", "Enterprise"].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#6938EF] dark:hover:text-[#9D7BFF] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Community Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Community</h3>
            <div className="grid gap-2">
              {["Forums", "Events", "Blog", "Membership"].map((item) => (
                <Link 
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#6938EF] dark:hover:text-[#9D7BFF] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Connect</h3>
            <div className="flex gap-2">
              {[
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Linkedin, href: "https://linkedin.com" },
                { icon: Github, href: "https://github.com" },
                { icon: Youtube, href: "https://youtube.com" }
              ].map(({ icon: Icon, href }) => (
                <Button 
                  key={href}
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-600 dark:text-gray-300 hover:text-[#6938EF] dark:hover:text-[#9D7BFF] hover:bg-purple-50 dark:hover:bg-purple-900/20" 
                  asChild
                >
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <Icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
            <Button 
              className="w-full bg-[#6938EF] dark:bg-[#9D7BFF] text-white hover:bg-[#5B2FD1] dark:hover:bg-[#8B63FF]"
            >
              Contact Us
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-purple-100 dark:bg-purple-900/40" />

        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} EduAI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}