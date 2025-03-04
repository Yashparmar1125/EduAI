import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReward } from 'react-rewards';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { Trophy, Star, Target, Brain, Code, Users, Zap, Award, Crown, BookOpen } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import confetti from 'canvas-confetti';
import { Button } from "@/components/ui/button";


const getRarityColor = (rarity) => {
  switch (rarity) {
    case 'common': return 'from-blue-500 to-blue-600';
    case 'uncommon': return 'from-green-500 to-green-600';
    case 'rare': return 'from-purple-500 to-purple-600';
    case 'epic': return 'from-yellow-500 to-yellow-600';
    default: return 'from-gray-500 to-gray-600';
  }
};


const AchievementCard = ({ achievement, theme }) => {
  const { reward } = useReward(`reward-${achievement.id}`, 'confetti', {
    elementCount: 70,
    spread: 50,
    startVelocity: 20,
    decay: 0.95,
    lifetime: 150,
    colors: ['#6938EF', '#9D7BFF', '#FFD700', '#FF69B4']
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "p-6 rounded-xl border relative overflow-hidden cursor-pointer backdrop-blur-sm",
        theme === 'dark' 
          ? 'bg-[#110C1D]/90 border-[#6938EF]/20' 
          : 'bg-card/90 border-border',
        !achievement.unlocked && 'opacity-70'
      )}
      onClick={() => achievement.unlocked && reward()}
    >
      <span id={`reward-${achievement.id}`} />
      <div className={cn(
        "absolute top-0 left-0 w-full h-1 bg-gradient-to-r",
        getRarityColor(achievement.rarity)
      )} />

      <div className="flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative",
          achievement.unlocked 
            ? "bg-gradient-to-br from-[#6938EF] to-[#9D7BFF] text-white" 
            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
        )}>
          {achievement.icon}
          {achievement.unlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
            >
              <Trophy className="h-2.5 w-2.5 text-white" />
            </motion.div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {achievement.title}
                {achievement.unlocked && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                  >
                    +{achievement.xp} XP
                  </motion.span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
            </div>
          </div>

          {!achievement.unlocked && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{achievement.progress}%</span>
              </div>
              <div className="relative">
                <Progress 
                  value={achievement.progress} 
                  className="h-2 rounded-full overflow-hidden" 
                  indicatorClassName={cn(
                    "transition-all duration-300",
                    achievement.progress >= 70 ? "bg-gradient-to-r from-green-400 to-green-500" :
                    achievement.progress >= 40 ? "bg-gradient-to-r from-yellow-400 to-yellow-500" :
                    "bg-gradient-to-r from-[#6938EF] to-[#9D7BFF]"
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {achievement.unlocked && (
        <div className="absolute inset-0 bg-[#6938EF]/5 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <motion.span 
            className="text-sm text-[#6938EF] font-medium bg-[#6938EF]/10 px-4 py-2 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            Click to celebrate! 🎉
          </motion.span>
        </div>
      )}
    </motion.div>
  );
};

const Achievements = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Move categories array inside the component and combine with icons
  const categories = [
    { id: 'all', label: 'All Achievements', icon: <Trophy className="h-4 w-4" /> },
    { id: 'learning', label: 'Learning', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'coding', label: 'Coding', icon: <Code className="h-4 w-4" /> },
    { id: 'community', label: 'Community', icon: <Users className="h-4 w-4" /> },
  ];
  const achievements = [
    {
      id: 1,
      title: "Fast Learner",
      description: "Completed 5 courses in a month",
      category: "learning",
      icon: <Zap className="h-5 w-5" />,
      unlocked: true,
      progress: 100,
      xp: 500,
      rarity: "common",
      unlockedAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Code Master",
      description: "Solved 50 coding challenges",
      category: "coding",
      icon: <Code className="h-5 w-5" />,
      unlocked: false,
      progress: 70,
      xp: 1000,
      rarity: "rare",
      requirements: "Complete 50 coding challenges"
    },
    {
      id: 3,
      title: "Team Player",
      category: "community",
      description: "Helped 10 community members",
      icon: <Users className="h-5 w-5" />,
      unlocked: false,
      progress: 40,
      xp: 750,
      rarity: "uncommon",
      requirements: "Help 10 different community members"
    },
    // Add more achievements...
  ];
  const userStats = {
    totalXP: 2500,
    level: 5,
    rank: "Rising Star",
    completedAchievements: achievements.filter(a => a.unlocked).length,
    totalAchievements: achievements.length
  };
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };
  const filteredAchievements = achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  );
  // Remove the old triggerConfetti function as we're using react-rewards now
  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)] p-4 sm:p-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "p-6 sm:p-8 rounded-2xl shadow-lg border mb-8",
            theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#6938EF]/10">
                <Trophy className="h-6 w-6 text-[#6938EF]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <h3 className="text-2xl font-bold text-[#6938EF]">{userStats.totalXP}</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#6938EF]/10">
                <Crown className="h-6 w-6 text-[#6938EF]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <h3 className="text-2xl font-bold text-[#6938EF]">{userStats.level}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#6938EF]/10">
                <Award className="h-6 w-6 text-[#6938EF]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rank</p>
                <h3 className="text-lg font-bold text-[#6938EF]">{userStats.rank}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#6938EF]/10">
                <Star className="h-6 w-6 text-[#6938EF]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <h3 className="text-2xl font-bold text-[#6938EF]">
                  {userStats.completedAchievements}/{userStats.totalAchievements}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Update Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={cn(
                "text-sm flex items-center gap-2",
                selectedCategory === category.id 
                  ? "bg-gradient-to-r from-[#6938EF] to-[#9D7BFF] hover:from-[#5B2FD1] hover:to-[#8B6AE5] text-white" 
                  : "border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              {category.label}
            </Button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;