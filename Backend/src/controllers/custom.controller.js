import Custom from "../models/custom.model.js";

// Get all custom courses for a user
export const getUserCustomCourses = async (req, res) => {
  try {
    const courses = await Custom.find({ user: req.user.userId });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error in getUserCustomCourses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching custom courses",
      error: error.message,
    });
  }
};

// Create a new custom course
export const createCustom = async (req, res) => {
  try {
    const { roadmapData } = req.body;
    console.log("Received roadmap data:", roadmapData);

    if (!roadmapData || !Array.isArray(roadmapData)) {
      return res.status(400).json({
        success: false,
        message: "Invalid roadmap data format",
      });
    }

    // Extract metadata from first item (index 0)
    const metadata = roadmapData[0] || {};

    // Process actual learning modules (starting from index 1)
    const modules = roadmapData.slice(1).map((module) => ({
      title: module.title || "",
      content: module.description || "", // Map description to content
      duration: module.duration || "",
      videoUrl: module.video || "", // Map video to videoUrl
      resources: Array.isArray(module.resources) ? module.resources : [],
      questions: Array.isArray(module.skilltest)
        ? module.skilltest.map((test) => ({
            question: test.question,
            options: test.options || [],
            answer: test.answer,
          }))
        : [], // Map skillTest to questions
    }));

    const newCustom = new Custom({
      title: ` ${metadata.interests || "Custom Course"}`,
      poster:
        "https://journey.temenos.com/images/easyblog_articles/171/Learning-paths-banner2.png",
      user: req.user.userId,
      modules: modules,
    });

    const savedCustom = await newCustom.save();

    res.status(201).json({
      success: true,
      message: "Custom course created successfully",
      data: savedCustom,
    });
  } catch (error) {
    console.error("Error in createCustom:", error);
    res.status(500).json({
      success: false,
      message: "Error creating custom course",
      error: error.message,
    });
  }
};

// Get custom course by ID
export const getCustomById = async (req, res) => {
  try {
    const { id } = req.params;

    const custom = await Custom.findOne({
      _id: id,
      user: req.user.userId,
    });

    if (!custom) {
      return res.status(404).json({
        success: false,
        message: "Custom course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: custom,
    });
  } catch (error) {
    console.error("Error in getCustomById:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching custom course",
      error: error.message,
    });
  }
};

export const updateModuleProgress = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { videoProgress, quizResults, completed } = req.body;
    const userId = req.user._id;

    const course = await Custom.findOne({ _id: courseId, userId });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Find existing progress or create new one
    let moduleProgress = course.progress.find(
      (p) => p.moduleId.toString() === moduleId
    );
    if (!moduleProgress) {
      moduleProgress = {
        moduleId,
        videoProgress: 0,
        completed: false,
      };
      course.progress.push(moduleProgress);
    }

    // Update progress
    if (videoProgress !== undefined) {
      moduleProgress.videoProgress = videoProgress;
    }

    if (quizResults) {
      moduleProgress.quizResults = quizResults;
    }

    if (completed) {
      moduleProgress.completed = true;
      moduleProgress.completedAt = new Date();
    }

    await course.save();

    res.json({ success: true, progress: moduleProgress });
  } catch (error) {
    console.error("Error updating module progress:", error);
    res.status(500).json({ error: "Failed to update progress" });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Custom.findOne({ _id: courseId, userId });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Calculate overall progress
    const totalModules = course.modules.length;
    const completedModules = course.progress.filter((p) => p.completed).length;
    const overallProgress = Math.round((completedModules / totalModules) * 100);

    res.json({
      overallProgress,
      completedModules: course.progress
        .filter((p) => p.completed)
        .map((p) => p.moduleId),
      moduleProgress: course.progress,
    });
  } catch (error) {
    console.error("Error getting course progress:", error);
    res.status(500).json({ error: "Failed to get progress" });
  }
};
