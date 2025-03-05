// controllers/progressController.js
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

export const startModule = async (req, res) => {
  const { courseId, moduleId } = req.params;
  try {
    const user = await User.findById(req.user.id);
    const course = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );
    if (!course.completedModules.includes(moduleId)) {
      course.completedModules.push(moduleId);
    }
    await user.save();
    res.status(200).json({ message: "Module started" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateModuleProgress = async (req, res) => {
  const { courseId } = req.params;
  const { progress } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const course = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );
    course.progress = progress;
    await user.save();
    res.status(200).json({ message: "Progress updated", progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeModule = async (req, res) => {
  const { courseId, moduleId } = req.params;
  try {
    const user = await User.findById(req.user.id);
    const course = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );
    if (!course.completedModules.includes(moduleId)) {
      course.completedModules.push(moduleId);
    }
    const courseData = await Course.findById(courseId);
    course.progress =
      (course.completedModules.length / courseData.modules.length) * 100;
    await user.save();
    res
      .status(200)
      .json({ message: "Module completed", progress: course.progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourseProgress = async (req, res) => {
  const { courseId } = req.params;
  try {
    const user = await User.findById(req.user.id);
    const course = user.enrolledCourses.find(
      (c) => c.courseId.toString() === courseId
    );
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompletedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("completedCourses");
    res.status(200).json(user.completedCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
