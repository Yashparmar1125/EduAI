import Gamification from "../models/gamification.model.js";

const RANKS = [
  { rank: "Novice", xp: 0 },
  { rank: "Apprentice", xp: 100 },
  { rank: "Adept", xp: 500 },
  { rank: "Journeyman", xp: 1000 },
  { rank: "Scholar", xp: 2500 },
  { rank: "Expert", xp: 5000 },
  { rank: "Mentor", xp: 10000 },
  { rank: "Master", xp: 20000 },
  { rank: "Grandmaster", xp: 35000 },
  { rank: "Sage", xp: 50000 },
  { rank: "Legend", xp: 75000 },
];

const ACHIEVEMENTS = [
  { name: "First Steps", xp: 10 },
  { name: "Quiz Master", xp: 50 },
  { name: "Steady Streak", xp: 30 },
  { name: "Course Finisher", xp: 100 },
  { name: "Community Helper", xp: 25 },
  { name: "Top Contributor", xp: 100 },
  { name: "Master of Mastery", xp: 150 },
  { name: "Consistency Champ", xp: 200 },
  { name: "Elite Scholar", xp: 250 },
];

// Update XP and rank with checks
export const updateXP = async (userId, xpEarned) => {
  try {
    const userGamification = await Gamification.findOne({ userId });
    if (!userGamification) throw new Error("User gamification data not found");

    if (xpEarned <= 0) return;

    userGamification.totalXP += xpEarned;

    // Calculate the new rank based on XP
    const newRank = RANKS.slice()
      .reverse()
      .find((rank) => userGamification.totalXP >= rank.xp);

    if (newRank && newRank.rank !== userGamification.rank) {
      userGamification.rank = newRank.rank;
    }
    await userGamification.save();
    const nextRankIndex =
      RANKS.findIndex((rank) => rank.rank === userGamification.rank) + 1;
    const nextRank = RANKS[nextRankIndex];
    // Calculate level based on XP
    const currXP =
      RANKS[RANKS.findIndex((rank) => rank.rank === userGamification.rank)].xp;
    const xpDifference = nextRank.xp - currXP;
    const levelThreshold = xpDifference / 3; // Dividing into 3 levels

    console.log(
      xpDifference,
      levelThreshold,
      userGamification.totalXP,
      nextRank.xp
    );

    let level = 0;
    if (userGamification.totalXP >= nextRank.xp - levelThreshold) {
      level = 3;
    } else if (userGamification.totalXP >= nextRank.xp - 2 * levelThreshold) {
      level = 2;
    } else if (userGamification.totalXP >= nextRank.xp - 3 * levelThreshold) {
      level = 1;
    }

    userGamification.level = level; // Add level to user gamification data

    await userGamification.save();
  } catch (error) {
    console.error("Error updating XP:", error);
  }
};

// Unlock achievements with validation
export const unlockAchievement = async (userId, achievementName) => {
  try {
    const userGamification = await Gamification.findOne({ userId });
    if (!userGamification) throw new Error("User gamification data not found");

    const alreadyUnlocked = userGamification.achievements.some(
      (a) => a.name === achievementName
    );
    if (alreadyUnlocked) return;

    const achievement = ACHIEVEMENTS.find((a) => a.name === achievementName);
    if (!achievement) throw new Error("Achievement not found");

    userGamification.achievements.push({
      name: achievementName,
      unlockedAt: new Date(),
    });

    userGamification.totalXP += achievement.xp;
    await userGamification.save();
  } catch (error) {
    console.error("Error unlocking achievement:", error);
  }
};

// Update daily login streak with checks
export const updateStreak = async (userId) => {
  try {
    const userGamification = await Gamification.findOne({ userId });
    if (!userGamification) throw new Error("User gamification data not found");

    const now = new Date();
    const lastLogin = userGamification.lastLogin;

    if (lastLogin) {
      const diff = (now - lastLogin) / (1000 * 60 * 60 * 24);
      if (diff >= 1 && diff < 2) {
        userGamification.streak += 1;
      } else if (diff >= 2) {
        userGamification.streak = 1;
      }
    } else {
      userGamification.streak = 1;
    }

    userGamification.lastLogin = now;

    if (userGamification.streak === 7) {
      await unlockAchievement(userId, "Steady Streak");
    }

    await userGamification.save();
  } catch (error) {
    console.error("Error updating streak:", error);
  }
};
