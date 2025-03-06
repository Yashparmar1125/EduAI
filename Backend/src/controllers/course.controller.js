import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import { deleteImage } from "../utils/cloudinary.js";

// Get course details
export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate("instructor", "name email")
      .lean();

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Check if user is instructor or enrolled student
    const isInstructor = course.instructor._id.toString() === req.user.userId;
    const isEnrolled = course.studentsEnrolled.includes(req.user.userId);

    if (!isInstructor && !isEnrolled) {
      return res.status(403).json({
        message: "You don't have access to this course",
      });
    }

    res.json({
      message: "Course details retrieved successfully",
      course,
    });
  } catch (error) {
    console.error("Error getting course details:", error);
    res.status(500).json({
      message: "Error getting course details",
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

    // Calculate total revenue (assuming all enrolled students paid the course price)
    const totalRevenue = course.price * totalStudents;

    // Calculate average rating (if you have a rating system)
    const averageRating = 4.5; // Placeholder - implement actual rating calculation

    res.json({
      totalStudents,
      completionRate,
      totalRevenue,
      averageRating,
    });
  } catch (error) {
    console.error("Error getting course statistics:", error);
    res.status(500).json({
      message: "Error getting course statistics",
      error: error.message,
    });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      instructor: req.user.userId,
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found or you're not authorized",
      });
    }

    // Delete course poster from Cloudinary if exists
    if (course.poster) {
      const publicId = course.poster.split("/").pop().split(".")[0];
      await deleteImage(publicId);
    }

    // Delete course from database
    await course.deleteOne();

    res.json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      message: "Error deleting course",
      error: error.message,
    });
  }
};

// Create a new course
export const createCourse = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, price, category, level, modules } = req.body;
    const instructor = req.user.userId;

    // Get the image URL from Cloudinary (uploaded via multer)
    const poster = req.file ? req.file.path : null;

    if (!poster) {
      return res.status(400).json({
        message: "Course poster is required",
      });
    }

    // Parse modules if it's a string
    let parsedModules;
    try {
      parsedModules =
        typeof modules === "string" ? JSON.parse(modules) : modules;
    } catch (error) {
      return res.status(400).json({
        message: "Invalid modules data",
      });
    }

    // Create new course
    const course = new Course({
      title,
      description,
      instructor,
      poster,
      price,
      category,
      level,
      modules: parsedModules,
    });

    await course.save();

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      message: "Error creating course",
      error: error.message,
    });
  }
};

// Update an existing course
export const updateCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId } = req.params;
    const updateData = { ...req.body };

    // If there's a new image
    if (req.file) {
      // Delete old image from Cloudinary if exists
      const oldCourse = await Course.findById(courseId);
      if (oldCourse && oldCourse.poster) {
        const publicId = oldCourse.poster.split("/").pop().split(".")[0];
        await deleteImage(publicId);
      }
      updateData.poster = req.file.path;
    }

    // Parse modules if it's a string
    if (typeof updateData.modules === "string") {
      try {
        updateData.modules = JSON.parse(updateData.modules);
      } catch (error) {
        return res.status(400).json({
          message: "Invalid modules data",
        });
      }
    }

    const course = await Course.findOneAndUpdate(
      { _id: courseId, instructor: req.user.userId },
      updateData,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found or you're not authorized to update it",
      });
    }

    res.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      message: "Error updating course",
      error: error.message,
    });
  }
};

// Enroll a user in a course
export const enrollCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId } = req.params;
    const userId = req.user.userId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Check if user is already enrolled
    if (course.studentsEnrolled.includes(userId)) {
      return res.status(400).json({
        message: "You are already enrolled in this course",
      });
    }

    course.studentsEnrolled.push(userId);
    await course.save();

    res.json({
      message: "Successfully enrolled in the course",
      course,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({
      message: "Error enrolling in course",
      error: error.message,
    });
  }
};

// Track the user's progress in a course
export const trackProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId);

    const courseProgress = user.enrolledCourses.find(
      (courseId) => courseId.toString() === req.params.courseId
    );

    if (!courseProgress) {
      return res
        .status(400)
        .json({ error: "Course not found in enrolled courses" });
    }

    res.json(courseProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark a module as completed
export const completeModule = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId);

    // Check if user is enrolled in the course
    if (!user.enrolledCourses.includes(course._id)) {
      return res
        .status(400)
        .json({ error: "User is not enrolled in this course" });
    }

    // Find the course progress for the specific course
    const courseProgress = user.enrolledCourses.find(
      (enrolledCourse) =>
        enrolledCourse.courseId.toString() === req.params.courseId
    );

    if (!courseProgress) {
      return res
        .status(400)
        .json({ error: "Progress not found for this course" });
    }

    // Mark module as completed
    courseProgress.completedModules.push(req.params.moduleId);

    // Calculate progress
    const moduleCount = course.modules.length;
    const completedModuleCount = courseProgress.completedModules.length;
    courseProgress.progress = (completedModuleCount / moduleCount) * 100;

    // Check if the course is complete and issue a certificate
    if (courseProgress.progress === 100) {
      courseProgress.certificateUrl = `https://yourdomain.com/certificates/${req.user.id}-${req.params.courseId}.pdf`;
    }

    await user.save();
    res.json({
      message: "Module completed",
      progress: courseProgress.progress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get instructor's courses
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
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

export const getAllCourses = async (req, res) => {
  try {
    const { search, category, level } = req.query;

    // Build filter object
    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (level && level !== "all") {
      filter.level = level;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name avatar")
      .select(
        "title description poster price rating studentsCount duration level category createdAt"
      );

    res.status(200).json({
      success: true,
      courses: courses.map((course) => ({
        id: course._id,
        title: course.title,
        description: course.description,
        instructor: course.instructor.name,
        rating: course.rating || 0,
        studentsCount: course.studentsCount || 0,
        duration: course.duration,
        level: course.level,
        category: course.category,
        poster: course.poster,
        price: course.price,
      })),
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};
