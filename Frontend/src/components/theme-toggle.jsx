import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  // Toggle between dark and light themes
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="relative">
      {/* Show Sun icon when in dark theme, and Moon icon when in light theme */}
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-transform duration-300 ease-in-out" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300 ease-in-out" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
