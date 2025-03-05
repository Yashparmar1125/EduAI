import Course from "../models/course.model.js";
import User from "../models/user.model.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, modules, price, category, level } = req.body;

    const course = await Course.create({
      title,
      description,
      instructor: req.user.id,
      modules,
      price,
      category,
      level,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing course
export const updateCourse = async (req, res) => {
  try {
    const { title, description, modules, price, category, level } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      {
        title,
        description,
        modules,
        price,
        category,
        level,
      },
      { new: true }
    );

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Enroll a user in a course
export const enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.courseId);

    // Check if user is already enrolled in the course
    if (user.enrolledCourses.includes(course._id)) {
      return res
        .status(400)
        .json({ error: "User already enrolled in this course." });
    }

    user.enrolledCourses.push(course._id);
    await user.save();

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
