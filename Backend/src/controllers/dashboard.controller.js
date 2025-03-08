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
        select:
          "title description instructor poster level price studentsEnrolled",
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
    const allCourses = await Course.find().populate("instructor", "name").lean();

    // Shuffle courses array and get the first 3 random courses
    const shuffledCourses = allCourses.sort(() => Math.random() - 0.5).slice(0, 3);
    // Get trending courses (just get latest 3 courses for now)
    const trendingCourses = shuffledCourses.slice(0, 3);
      

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
        ? user.enrolledCourses
            .map((enrollment) => {
              // Ensure courseId exists and is populated correctly
              if (!enrollment.courseId) {
                console.error(
                  "Course data missing for enrolled course:",
                  enrollment
                );
                return null;
              }

              const courseData = {
                id: enrollment.courseId._id,
                title: enrollment.courseId.title || "Untitled Course",
                description:
                  enrollment.courseId.description || "No description available",
                instructor:
                  enrollment.courseId.instructor?.name || "Unknown Instructor",
                progress: enrollment.progress || 0,
                poster: enrollment.courseId.poster || "",
                level: enrollment.courseId.level || "beginner",
                currentModule: enrollment.currentModule,
                videoProgress: enrollment.videoProgress,
                completedModules: enrollment.completedModules || [],
              };

              return courseData;
            })
            .filter(Boolean) // Filter out any nulls from missing course data
        : [],
      completedCourses:
        user.completedCourses?.map((cert) => ({
          id: cert._id,
          courseTitle: cert.course?.title || "Untitled Course",
          issueDate: cert.issueDate,
          blockchainHash: cert.blockchainHash,
        })) || [],
      badges:
        user.badges?.map((badge) => ({
          id: badge._id,
          name: badge.name || "Unnamed Badge",
          description: badge.description || "No description available",
          image: badge.image || "",
          unlocked: badge.unlocked || false, // Assuming `unlocked` is a boolean indicating whether the user earned it
        })) || [],
      trendingCourses: trendingCourses.map((course) => ({
        id: course._id,
        title: course.title || "Untitled Course",
        description: course.description || "No description available",
        instructor: course.instructor?.name || "Unknown Instructor",
        poster: course.poster || "",
        level: course.level || "beginner",
        price: course.price || 0,
        studentsCount: course.studentsEnrolled?.length || 0,
      })),
    };

   

    res.status(200).json(response);
  } catch (error) {
    console.error(
      "Error fetching dashboard data for user ID:",
      req.user.userId
    );
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};
