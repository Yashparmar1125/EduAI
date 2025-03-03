import { Button } from "@/components/ui/button"
import { FaBook, FaChartLine, FaUsers } from "react-icons/fa" // Importing icons

export function Home() {
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-16 md:py-24 gap-8">
          {/* Left side - Content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Master Your Skills with
              <span className="text-primary"> Personalized</span> Learning Paths
            </h1>
            <p className="text-lg text-muted-foreground">
              Enhance your professional journey with AI-driven learning paths, 
              skill tracking, and a supportive community. Start your 
              personalized learning experience today.
            </p>
            <div className="flex gap-4">
              <Button size="lg">Start Learning</Button>
              <Button variant="outline" size="lg">Explore Paths</Button>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex-1 relative">
            <div className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl p-8">
              <img
                src="/learning-illustration.svg"
                alt="Learning Illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          <div className="space-y-4 p-6 rounded-lg border">
            <div className="flex items-center gap-2">
              <FaBook className="text-primary" size={24} />
              <h3 className="text-xl font-semibold">Personalized Learning</h3>
            </div>
            <p className="text-muted-foreground">
              AI-driven paths tailored to your goals and current skill level
            </p>
          </div>
          <div className="space-y-4 p-6 rounded-lg border">
            <div className="flex items-center gap-2">
              <FaChartLine className="text-primary" size={24} />
              <h3 className="text-xl font-semibold">Skill Tracking</h3>
            </div>
            <p className="text-muted-foreground">
              Monitor your progress and identify areas for improvement
            </p>
          </div>
          <div className="space-y-4 p-6 rounded-lg border">
            <div className="flex items-center gap-2">
              <FaUsers className="text-primary" size={24} />
              <h3 className="text-xl font-semibold">Community Support</h3>
            </div>
            <p className="text-muted-foreground">
              Learn and grow together with like-minded professionals
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
