import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReward } from 'react-rewards';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { Trophy, Star, Target, Brain, Code, Users, Zap, Award, Crown, BookOpen, Medal } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import confetti from 'canvas-confetti';
import { Button } from "@/components/ui/button";
import { getAchievements } from "@/api/axios.api";

const getRarityColor = (rarity) => {
  switch (rarity) {
    case 'common': return 'from-blue-500 to-blue-600';
    case 'uncommon': return 'from-green-500 to-green-600';
    case 'rare': return 'from-purple-500 to-purple-600';
    case 'epic': return 'from-yellow-500 to-yellow-600';
    case 'legendary': return 'bg-yellow-500';
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

  const getIcon = (type) => {
    switch (type) {
      case 'course_completion':
        return <Trophy className="w-6 h-6" />;
      case 'module_completion':
        return <Award className="w-6 h-6" />;
      case 'skill_mastery':
        return <Star className="w-6 h-6" />;
      case 'streak':
        return <Medal className="w-6 h-6" />;
      default:
        return <Target className="w-6 h-6" />;
    }
  };

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
          {getIcon(achievement.type)}
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

const HowToEarnSection = ({ theme }) => {
  const earningMethods = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Complete Courses",
      description: "Finish courses and modules to earn course completion achievements",
      category: "learning"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Code Challenges",
      description: "Solve coding challenges and complete programming tasks",
      category: "coding"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Engagement",
      description: "Help others, participate in discussions, and share knowledge",
      category: "community"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Skill Mastery",
      description: "Master specific skills and complete skill-based assessments",
      category: "learning"
    },
    {
      icon: <Medal className="w-6 h-6" />,
      title: "Learning Streaks",
      description: "Maintain consistent learning habits and daily streaks",
      category: "learning"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Special Achievements",
      description: "Complete special challenges and milestone achievements",
      category: "all"
    }
  ];

  return (
    <div className="space-y-8">
      <div className={cn(
        "p-6 rounded-xl border",
        theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
      )}>
        <h2 className="text-2xl font-bold mb-4">How to Earn Achievements</h2>
        <p className="text-muted-foreground mb-6">
          Achievements are earned by completing various learning activities and challenges. 
          Each achievement comes with XP rewards and helps track your learning progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {earningMethods.map((method, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-xl border group hover:border-[#6938EF]/50 transition-colors",
              theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                theme === 'dark' ? 'bg-[#6938EF]/20' : 'bg-[#6938EF]/10'
              )}>
                {method.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={cn(
        "p-6 rounded-xl border",
        theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
      )}>
        <h3 className="text-xl font-semibold mb-4">Achievement Rarities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-sm">Common</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">Rare</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm">Epic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Legendary</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Achievements = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [rank, setRank] = useState('Novice');
  const [streak, setStreak] = useState(0);

  // Move categories array inside the component and combine with icons
  const categories = [
    { id: 'all', label: 'All Achievements', icon: <Trophy className="h-4 w-4" /> },
    { id: 'learning', label: 'Learning', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'coding', label: 'Coding', icon: <Code className="h-4 w-4" /> },
    { id: 'community', label: 'Community', icon: <Users className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await getAchievements();
        setAchievements(response.achievements || []);
        setTotalXP(response.totalXP || 0);
        setLevel(response.level || 1);
        setRank(response.rank || 'Novice');
        setStreak(response.streak || 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        setError(error.response?.data?.message || 'Failed to fetch achievements');
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  if (loading) {
    return (
      <div className={cn(
        "min-h-[calc(100vh-4rem)] flex items-center justify-center",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6938EF]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "min-h-[calc(100vh-4rem)] flex items-center justify-center p-4",
        theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
      )}>
        <div className={cn(
          "max-w-md w-full p-8 rounded-xl border text-center",
          theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
        )}>
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const filteredAchievements = achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  );

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
                <h3 className="text-2xl font-bold text-[#6938EF]">{totalXP}</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#6938EF]/10">
                <Crown className="h-6 w-6 text-[#6938EF]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level {level}</p>
                <h3 className="text-2xl font-bold text-[#6938EF]">{rank}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#6938EF]/10">
                <Award className="h-6 w-6 text-[#6938EF]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <h3 className="text-lg font-bold text-[#6938EF]">
                  {streak} {streak === 1 ? 'day' : 'days'}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#6938EF]/10">
                <Star className="h-6 w-6 text-[#6938EF]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <h3 className="text-2xl font-bold text-[#6938EF]">
                  {unlockedCount}/{totalCount}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
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

        {/* Achievements Grid or How to Earn Section */}
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement._id}
                achievement={achievement}
                theme={theme}
              />
            ))}
            {filteredAchievements.length === 0 && (
              <div className={cn(
                "col-span-full text-center py-12 rounded-xl border",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
              )}>
                <p className="text-muted-foreground">No achievements found in this category</p>
              </div>
            )}
          </div>
        ) : (
          <HowToEarnSection theme={theme} />
        )}
      </div>
    </div>
  );
};

export default Achievements;