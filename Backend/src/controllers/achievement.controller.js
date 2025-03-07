import User from "../models/user.model.js";
import Achievement from "../models/achievement.model.js";
import Gamification from "../models/gamification.model.js";
import { checkAchievements } from "../utils/achievement.util.js";
import { updateXP, unlockAchievement } from "../utils/gamification.util.js";

export const getAchievements = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's gamification data
    const gamificationData = await Gamification.findOne({ userId });
    if (!gamificationData) {
      // Create new gamification data if it doesn't exist
      const newGamification = new Gamification({ userId });
      await newGamification.save();
      return res.status(200).json({
        achievements: [],
        totalXP: 0,
        level: 1,
        rank: "Novice",
        streak: 0,
      });
    }

    // Get all achievements with their details
    const allAchievements = await Achievement.find();

    // Map achievements with unlocked status
    const mappedAchievements = allAchievements.map((achievement) => {
      const unlockedAchievement = gamificationData.achievements.find(
        (a) => a.name === achievement.title
      );

      return {
        ...achievement.toObject(),
        unlocked: !!unlockedAchievement,
        unlockedAt: unlockedAchievement?.unlockedAt,
        progress: achievement.progress || 0,
      };
    });

    res.status(200).json({
      achievements: mappedAchievements,
      totalXP: gamificationData.totalXP,
      level: gamificationData.level,
      rank: gamificationData.rank,
      streak: gamificationData.streak,
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ error: error.message });
  }
};

export const checkUserAchievements = async (req, res) => {
  try {
    const userId = req.user.userId;
    const gamificationData = await Gamification.findOne({ userId });

    if (!gamificationData) {
      return res.status(404).json({ error: "Gamification data not found" });
    }

    // Check for new achievements
    const newAchievements = await checkAchievements(userId);

    // Unlock new achievements and update XP
    for (const achievement of newAchievements) {
      await unlockAchievement(userId, achievement.title);
      await updateXP(userId, achievement.xpReward);
    }

    // Get updated gamification data
    const updatedData = await Gamification.findOne({ userId });

    res.status(200).json({
      message: "Achievements checked successfully",
      newAchievements,
      totalXP: updatedData.totalXP,
      level: updatedData.level,
      rank: updatedData.rank,
    });
  } catch (error) {
    console.error("Error checking achievements:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAchievementDetails = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.achievementId);
    if (!achievement) {
      return res.status(404).json({ error: "Achievement not found" });
    }

    // Get user's gamification data to check if achievement is unlocked
    const gamificationData = await Gamification.findOne({
      userId: req.user.userId,
    });
    const isUnlocked = gamificationData?.achievements.some(
      (a) => a.name === achievement.title
    );

    res.status(200).json({
      achievement: {
        ...achievement.toObject(),
        unlocked: isUnlocked,
        unlockedAt: isUnlocked
          ? gamificationData.achievements.find(
              (a) => a.name === achievement.title
            ).unlockedAt
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching achievement details:", error);
    res.status(500).json({ error: error.message });
  }
};
