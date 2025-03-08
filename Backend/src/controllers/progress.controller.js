// controllers/progressController.js
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import { generateCertificate } from "../utils/certificate.util.js";
import { checkAchievements } from "../utils/achievement.util.js";
import { verifyCertificate } from "../utils/certificate.util.js";

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

      // Only generate certificate if one doesn't exist
      if (!enrolledCourse.certificateId) {
        try {
          const certificateId = await generateCertificate(user._id, courseId);
          enrolledCourse.certificateId = certificateId;
        } catch (error) {
          console.error("Error generating certificate:", error);
          // Continue without certificate generation
        }
      }

      // Check for achievements when course is completed
      const achievementResults = await checkAchievements(user._id, courseId);

      await user.save();
      res.status(200).json({
        message: "Module completed successfully",
        progress: enrolledCourse.progress,
        completedModules: enrolledCourse.completedModules,
        isCourseCompleted: completedModulesCount === totalModules,
        certificateId: enrolledCourse.certificateId,
        achievements: achievementResults,
      });
    } else {
      await user.save();
      res.status(200).json({
        message: "Module completed successfully",
        progress: enrolledCourse.progress,
        completedModules: enrolledCourse.completedModules,
        isCourseCompleted: false,
      });
    }
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

export const getCourseCompletionStatus = async (req, res) => {
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

    const isCompleted = enrolledCourse.progress === 100;

    res.status(200).json({
      isCompleted,
      progress: enrolledCourse.progress,
      certificateUrl: enrolledCourse.certificateUrl,
      completedModules: enrolledCourse.completedModules.length,
      totalModules: enrolledCourse.courseId.modules.length,
    });
  } catch (error) {
    console.error("Error getting course completion status:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCertificate = async (req, res) => {
  const { courseId } = req.params;
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const enrolledCourse = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );

    if (!enrolledCourse || !enrolledCourse.certificateId) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    // Verify the certificate
    const verificationResult = await verifyCertificate(
      enrolledCourse.certificateId
    );

    if (!verificationResult.isValid) {
      return res.status(400).json({ error: verificationResult.message });
    }

    res.status(200).json({
      certificate: verificationResult.certificate,
    });
  } catch (error) {
    console.error("Error getting certificate:", error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyCertificatePublic = async (req, res) => {
  const { certificateId } = req.params;
  try {
    const verificationResult = await verifyCertificate(certificateId);
    res.status(200).json(verificationResult);
  } catch (error) {
    console.error("Error verifying certificate:", error);
    res.status(500).json({ error: error.message });
  }
};
