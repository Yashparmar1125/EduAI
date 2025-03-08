import User from "../models/user.model.js";
import Achievement from "../models/achievement.model.js";
import Course from "../models/course.model.js";
import Gamification from "../models/gamification.model.js";
import { updateXP, unlockAchievement } from "./gamification.util.js";

// Define achievement templates
const achievementTemplates = [
  {
    title: "First Course Completed",
    description: "Complete your first course",
    type: "course_completion",
    requirement: 1,
    xpReward: 100,
    category: "learning",
    rarity: "common",
    icon: "trophy",
  },
  {
    title: "Course Master",
    description: "Complete 5 courses",
    type: "course_completion",
    requirement: 5,
    xpReward: 500,
    category: "learning",
    rarity: "rare",
    icon: "crown",
  },
  {
    title: "Module Explorer",
    description: "Complete 10 modules across all courses",
    type: "module_completion",
    requirement: 10,
    xpReward: 300,
    category: "learning",
    rarity: "uncommon",
    icon: "book-open",
  },
  {
    title: "Learning Streak",
    description: "Maintain a 7-day learning streak",
    type: "streak",
    requirement: 7,
    xpReward: 200,
    category: "learning",
    rarity: "rare",
    icon: "flame",
  },
  {
    title: "Community Helper",
    description: "Help 5 other students with their questions",
    type: "community",
    requirement: 5,
    xpReward: 400,
    category: "community",
    rarity: "uncommon",
    icon: "users",
  },
  {
    title: "Code Warrior",
    description: "Complete 20 coding challenges",
    type: "coding",
    requirement: 20,
    xpReward: 600,
    category: "coding",
    rarity: "epic",
    icon: "code",
  },
];

export const checkAchievements = async (userId, courseId) => {
  try {
    // Get user data with populated courses
    const user = await User.findById(userId).populate({
      path: "enrolledCourses.courseId",
      model: "Course",
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get or create gamification data
    let gamificationData = await Gamification.findOne({ userId });
    if (!gamificationData) {
      gamificationData = new Gamification({ userId });
      await gamificationData.save();
    }

    // Get user's completed courses
    const completedCourses = user.enrolledCourses.filter(
      (c) => c.progress === 100
    );

    // Track unlocked achievements
    const unlockedAchievements = [];

    // Check each achievement template
    for (const template of achievementTemplates) {
      try {
        // Check if achievement already exists
        let achievement = await Achievement.findOne({ title: template.title });

        // If achievement doesn't exist, create it
        if (!achievement) {
          achievement = await Achievement.create(template);
        }

        // Skip if already unlocked
        if (
          gamificationData.achievements.some(
            (a) => a.name === achievement.title
          )
        ) {
          continue;
        }

        let shouldUnlock = false;
        let progress = 0;

        switch (achievement.type) {
          case "course_completion":
            // Check for specific course completion
            if (courseId) {
              const courseCompleted = completedCourses.some(
                (c) => c.courseId._id.toString() === courseId
              );
              progress = courseCompleted ? 100 : 0;
              shouldUnlock = courseCompleted;
            } else {
              // Check for total course completions
              progress =
                (completedCourses.length / achievement.requirement) * 100;
              shouldUnlock = completedCourses.length >= achievement.requirement;
            }
            break;

          case "module_completion":
            // Check for module completion in specific course
            if (courseId) {
              const course = user.enrolledCourses.find(
                (c) => c.courseId._id.toString() === courseId
              );
              if (course && course.courseId) {
                const totalModules = course.courseId.modules.length;
                progress =
                  (course.completedModules.length / totalModules) * 100;
                shouldUnlock =
                  course.completedModules.length >= achievement.requirement;
              }
            }
            break;

          case "streak":
            // Use streak from gamification data
            progress =
              (gamificationData.streak / achievement.requirement) * 100;
            shouldUnlock = gamificationData.streak >= achievement.requirement;
            break;

          default:
            continue;
        }

        // Update achievement progress
        achievement.progress = Math.min(progress, 100);
        await achievement.save();

        // Unlock achievement if conditions met
        if (shouldUnlock) {
          await unlockAchievement(userId, achievement.title);
          await updateXP(userId, achievement.xpReward);

          unlockedAchievements.push({
            title: achievement.title,
            description: achievement.description,
            xpReward: achievement.xpReward,
            rarity: achievement.rarity,
          });

          console.log(
            `Achievement unlocked: ${achievement.title} (+${achievement.xpReward} XP)`
          );
        }
      } catch (error) {
        console.error(`Error processing achievement ${template.title}:`, error);
        continue;
      }
    }

    // Get updated gamification data
    const updatedData = await Gamification.findOne({ userId });

    // Return information about unlocked achievements
    return {
      unlockedAchievements,
      totalXP: updatedData.totalXP,
      level: updatedData.level,
      rank: updatedData.rank,
      streak: updatedData.streak,
    };
  } catch (error) {
    console.error("Error checking achievements:", error);
    throw error;
  }
};
