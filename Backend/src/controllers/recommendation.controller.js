import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Gamification from "../models/gamification.model.js";

export const getRecommendedCourses = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user data with enrolled courses and gamification data
    const [user, gamificationData] = await Promise.all([
      User.findById(userId).populate("enrolledCourses.courseId"),
      Gamification.findOne({ userId }),
    ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's level and completed courses
    const userLevel = gamificationData?.level || 1;
    const completedCourseIds = user.enrolledCourses
      .filter((course) => course.progress === 100)
      .map((course) => course.courseId._id);

    // Get enrolled course IDs to exclude them from recommendations
    const enrolledCourseIds = user.enrolledCourses.map(
      (course) => course.courseId._id
    );

    // Get courses that match user's level and aren't enrolled in
    let recommendedCourses = await Course.find({
      _id: { $nin: enrolledCourseIds },
      level: getDifficultyForLevel(userLevel),
    })
      .populate("instructor", "name")
      .limit(6);

    // If not enough recommendations, add courses from next level
    if (recommendedCourses.length < 3) {
      const additionalCourses = await Course.find({
        _id: {
          $nin: [...enrolledCourseIds, ...recommendedCourses.map((c) => c._id)],
        },
        level: getNextDifficulty(getDifficultyForLevel(userLevel)),
      })
        .populate("instructor", "name")
        .limit(3 - recommendedCourses.length);

      recommendedCourses = [...recommendedCourses, ...additionalCourses];
    }

    // Calculate average rating and format response
    const formattedCourses = recommendedCourses.map((course) => ({
      id: course._id,
      title: course.title,
      description: course.description,
      image: course.poster,
      instructor: course.instructor.name,
      rating: calculateAverageRating(course),
      duration: calculateCourseDuration(course),
      level: course.level,
      studentsCount: course.studentsEnrolled?.length || 0,
      price: course.price,
    }));

    res.status(200).json({
      recommendations: formattedCourses,
    });
  } catch (error) {
    console.error("Error getting course recommendations:", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to determine course difficulty based on user level
const getDifficultyForLevel = (level) => {
  if (level <= 3) return "beginner";
  if (level <= 7) return "intermediate";
  return "advanced";
};

// Helper function to get next difficulty level
const getNextDifficulty = (currentDifficulty) => {
  const difficulties = ["beginner", "intermediate", "advanced"];
  const currentIndex = difficulties.indexOf(currentDifficulty);
  return difficulties[Math.min(currentIndex + 1, difficulties.length - 1)];
};

// Helper function to calculate average course rating
const calculateAverageRating = (course) => {
  // Placeholder: Replace with actual rating calculation when implemented
  return (4.5 + Math.random() * 0.5).toFixed(1);
};

// Helper function to calculate course duration
const calculateCourseDuration = (course) => {
  // Calculate total duration from modules
  const totalMinutes = course.modules.reduce((total, module) => {
    // Assuming each video is ~15 minutes and quiz takes ~5 minutes
    return total + 15 + 5;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};
