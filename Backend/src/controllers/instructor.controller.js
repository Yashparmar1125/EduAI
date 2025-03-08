import Course from "../models/course.model.js";
import User from "../models/user.model.js";

// Get instructor's dashboard statistics
export const getInstructorStats = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.userId })
      .populate("studentsEnrolled")
      .lean();

    // Calculate total students (unique students across all courses)
    const uniqueStudents = new Set();
    let totalRevenue = 0;
    let totalReviews = 0;
    let totalRating = 0;

    courses.forEach((course) => {
      // Add students to set
      course.studentsEnrolled.forEach((student) =>
        uniqueStudents.add(student._id.toString())
      );

      // Calculate revenue
      totalRevenue += course.price * course.studentsEnrolled.length;

      // Calculate ratings (if implemented)
      if (course.reviews) {
        totalReviews += course.reviews.length;
        totalRating += course.reviews.reduce(
          (acc, review) => acc + review.rating,
          0
        );
      }
    });

    const stats = {
      totalStudents: uniqueStudents.size,
      activeCourses: courses.length,
      totalRevenue,
      averageRating:
        totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0,
      recentCourses: courses
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 3)
        .map((course) => ({
          _id: course._id,
          title: course.title,
          studentsCount: course.studentsEnrolled.length,
          poster: course.poster,
          status: course.status || "draft",
        })),
    };

    res.json({
      success: true,
      message: "Instructor statistics retrieved successfully",
      stats,
    });
  } catch (error) {
    console.error("Error getting instructor statistics:", error);
    res.status(500).json({
      message: "Error getting instructor statistics",
      error: error.message,
    });
  }
};

// Get instructor's courses
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      message: "Instructor courses retrieved successfully",
      courses,
    });
  } catch (error) {
    console.error("Error getting instructor courses:", error);
    res.status(500).json({
      message: "Error getting instructor courses",
      error: error.message,
    });
  }
};

// Get course statistics
export const getCourseStats = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      instructor: req.user.userId,
    }).populate("studentsEnrolled");

    if (!course) {
      return res.status(404).json({
        message: "Course not found or you're not authorized",
      });
    }

    // Calculate statistics
    const totalStudents = course.studentsEnrolled.length;

    // Calculate completion rate
    const completedStudents = course.studentsEnrolled.filter(
      (student) =>
        student.progress &&
        student.progress[courseId] &&
        student.progress[courseId] === 100
    ).length;
    const completionRate =
      totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;

    // Calculate total revenue
    const totalRevenue = course.price * totalStudents;

    // Calculate average rating
    const averageRating = course.reviews
      ? (
          course.reviews.reduce((acc, review) => acc + review.rating, 0) /
          course.reviews.length
        ).toFixed(1)
      : 0;

    res.json({
      totalStudents,
      completionRate,
      totalRevenue,
      averageRating,
      success: true,
    });
  } catch (error) {
    console.error("Error getting course statistics:", error);
    res.status(500).json({
      message: "Error getting course statistics",
      error: error.message,
    });
  }
};
