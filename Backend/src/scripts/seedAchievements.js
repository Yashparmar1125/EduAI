import mongoose from "mongoose";
import Achievement from "../models/achievement.model.js";

const achievements = [
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

const seedAchievements = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing achievements
    await Achievement.deleteMany({});
    console.log("Cleared existing achievements");

    // Insert new achievements
    const insertedAchievements = await Achievement.insertMany(achievements);
    console.log(`Seeded ${insertedAchievements.length} achievements`);

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding achievements:", error);
    process.exit(1);
  }
};

seedAchievements();
