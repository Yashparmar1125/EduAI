// controllers/progressController.js
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

export const getCourseProgress = async (req, res) => {
  const { courseId } = req.params;
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the enrolled course
    const enrolledCourse = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );

    if (!enrolledCourse) {
      return res
        .status(404)
        .json({ error: "Course not found in enrolled courses" });
    }

    // Get the course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Calculate progress
    const totalModules = course.modules.length;
    const completedModulesCount = enrolledCourse.completedModules.length;
    const progress = (completedModulesCount / totalModules) * 100;

    res.status(200).json({
      progress,
      completedModules: enrolledCourse.completedModules,
      currentModule: enrolledCourse.currentModule,
      totalModules,
      completedModulesCount,
    });
  } catch (error) {
    console.error("Error getting course progress:", error);
    res.status(500).json({ error: error.message });
  }
};

export const startModule = async (req, res) => {
  const { courseId, moduleId } = req.params;
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const enrolledCourse = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );

    if (!enrolledCourse) {
      return res
        .status(404)
        .json({ error: "Course not found in enrolled courses" });
    }

    // Set current module if not set
    if (!enrolledCourse.currentModule) {
      enrolledCourse.currentModule = moduleId;
    }

    // Add to completed modules if not already there
    if (!enrolledCourse.completedModules.includes(moduleId)) {
      enrolledCourse.completedModules.push(moduleId);
    }

    await user.save();
    res.status(200).json({ message: "Module started successfully" });
  } catch (error) {
    console.error("Error starting module:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateModuleProgress = async (req, res) => {
  const { courseId, moduleId } = req.params;
  const { progress } = req.body;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const enrolledCourse = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );

    if (!enrolledCourse) {
      return res
        .status(404)
        .json({ error: "Course not found in enrolled courses" });
    }

    // Update the progress
    enrolledCourse.progress = progress;
    enrolledCourse.currentModule = moduleId;

    await user.save();
    res.status(200).json({
      message: "Progress updated successfully",
      progress: enrolledCourse.progress,
    });
  } catch (error) {
    console.error("Error updating module progress:", error);
    res.status(500).json({ error: error.message });
  }
};

export const completeModule = async (req, res) => {
  const { courseId, moduleId } = req.params;
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const enrolledCourse = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );

    if (!enrolledCourse) {
      return res
        .status(404)
        .json({ error: "Course not found in enrolled courses" });
    }

    // Add to completed modules if not already there
    if (!enrolledCourse.completedModules.includes(moduleId)) {
      enrolledCourse.completedModules.push(moduleId);
    }

    // Get course details to calculate progress
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Calculate overall progress
    const totalModules = course.modules.length;
    const completedModulesCount = enrolledCourse.completedModules.length;
    enrolledCourse.progress = (completedModulesCount / totalModules) * 100;

    // Check if course is completed (all modules completed)
    if (completedModulesCount === totalModules) {
      // Add course to completed courses if not already there
      if (!user.completedCourses.includes(courseId)) {
        user.completedCourses.push(courseId);
      }

      // Generate certificate URL (you can implement certificate generation logic here)
      enrolledCourse.certificateUrl = `/certificates/${user._id}-${courseId}.pdf`;
    }

    await user.save();
    res.status(200).json({
      message: "Module completed successfully",
      progress: enrolledCourse.progress,
      completedModules: enrolledCourse.completedModules,
      isCourseCompleted: completedModulesCount === totalModules,
      certificateUrl: enrolledCourse.certificateUrl,
    });
  } catch (error) {
    console.error("Error completing module:", error);
    res.status(500).json({ error: error.message });
  }
};

export const isCourseCompleted = async (req, res) => {
  const { courseId } = req.params;
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const enrolledCourse = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );

    if (!enrolledCourse) {
      return res
        .status(404)
        .json({ error: "Course not found in enrolled courses" });
    }

    // Get course details to check total modules
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const totalModules = course.modules.length;
    const completedModulesCount = enrolledCourse.completedModules.length;
    const isCompleted = completedModulesCount === totalModules;

    res.status(200).json({
      isCompleted,
      progress: enrolledCourse.progress,
      completedModules: completedModulesCount,
      totalModules,
      certificateUrl: enrolledCourse.certificateUrl,
    });
  } catch (error) {
    console.error("Error checking course completion:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCompletedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get completed courses (where progress is 100%)
    const completedCourses = user.enrolledCourses.filter(
      (course) => course.progress === 100
    );

    res.status(200).json(completedCourses);
  } catch (error) {
    console.error("Error getting completed courses:", error);
    res.status(500).json({ error: error.message });
  }
};
