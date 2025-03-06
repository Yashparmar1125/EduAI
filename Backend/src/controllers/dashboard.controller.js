import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Badge from "../models/badge.model.js";
import Certificate from "../models/certificate.model.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user data with populated courses and badges
    const user = await User.findById(userId)
      .populate({
        path: "enrolledCourses.courseId",
        select: "title description instructor poster level",
        populate: {
          path: "instructor",
          select: "name",
        },
      })
      .populate("badges")
      .populate({
        path: "completedCourses",
        model: Certificate,
        populate: {
          path: "course",
          select: "title",
        },
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get trending courses (just get latest 3 courses for now)
    const trendingCourses = await Course.find()
      .populate("instructor", "name")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    // Format the response based on whether user has enrolled courses
    const hasEnrolledCourses =
      user.enrolledCourses && user.enrolledCourses.length > 0;

    const response = {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      isNewUser: !hasEnrolledCourses,
      enrolledCourses: hasEnrolledCourses
        ? user.enrolledCourses.map((course) => ({
            id: course.courseId._id,
            title: course.courseId.title,
            description: course.courseId.description,
            instructor: course.courseId.instructor.name,
            progress: course.progress,
            poster: course.courseId.poster,
            level: course.courseId.level,
          }))
        : [],
      completedCourses:
        user.completedCourses?.map((cert) => ({
          id: cert._id,
          courseTitle: cert.course?.title,
          issueDate: cert.issueDate,
          blockchainHash: cert.blockchainHash,
        })) || [],
      badges:
        user.badges?.map((badge) => ({
          id: badge._id,
          name: badge.name,
          description: badge.description,
          image: badge.image,
          unlocked: true,
        })) || [],
      trendingCourses: trendingCourses.map((course) => ({
        id: course._id,
        title: course.title,
        description: course.description,
        instructor: course.instructor.name,
        poster: course.poster,
        level: course.level,
        price: course.price,
        studentsCount: course.studentsEnrolled.length,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
