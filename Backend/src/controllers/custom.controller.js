import Custom from "../models/custom.model.js";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import { deleteImage } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// Get custom course details
export const getCustomDetails = async (req, res) => {
  try {
    const custom = await Custom.findById(req.params.customId)
      .populate("instructor", "name")
      .lean();

    if (!custom) {
      return res.status(404).json({
        message: "Custom course not found",
      });
    }

    // Check if the user is enrolled in this custom course
    const isEnrolled = custom.studentsEnrolled.some(
      (studentId) => studentId.toString() === req.user.userId
    );

    res.json({
      success: true,
      custom: {
        ...custom,
        isEnrolled,
      },
    });
  } catch (error) {
    console.error("Error fetching custom course details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching custom course details",
      error: error.message,
    });
  }
};

// Get custom course statistics
export const getCustomStats = async (req, res) => {
  try {
    const { customId } = req.params;

    const custom = await Custom.findOne({
      _id: customId,
      instructor: req.user.userId,
    }).populate("studentsEnrolled");

    if (!custom) {
      return res.status(404).json({
        message: "Custom course not found or you're not authorized",
      });
    }

    // Calculate statistics
    const totalStudents = custom.studentsEnrolled.length;

    // Calculate completion rate
    const completedStudents = custom.studentsEnrolled.filter(
      (student) =>
        student.progress &&
        student.progress[customId] &&
        student.progress[customId] === 100
    ).length;
    const completionRate =
      totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;

    // Calculate total revenue (assuming all enrolled students paid the course price)
    const totalRevenue = custom.price * totalStudents;

    // Calculate average rating (if you have a rating system)
    const averageRating = 4.5; // Placeholder - implement actual rating calculation

    res.json({
      totalStudents,
      completionRate,
      totalRevenue,
      averageRating,
    });
  } catch (error) {
    console.error("Error getting custom course statistics:", error);
    res.status(500).json({
      message: "Error getting custom course statistics",
      error: error.message,
    });
  }
};

// Delete custom course
export const deleteCustom = async (req, res) => {
  try {
    const { customId } = req.params;

    const custom = await Custom.findOne({
      _id: customId,
      instructor: req.user.userId,
    });

    if (!custom) {
      return res.status(404).json({
        message: "Custom course not found or you're not authorized",
      });
    }

    // Delete custom course poster from Cloudinary if exists
    if (custom.poster) {
      const publicId = custom.poster.split("/").pop().split(".")[0];
      await deleteImage(publicId);
    }

    // Delete custom course from database
    await custom.deleteOne();

    res.json({
      message: "Custom course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting custom course:", error);
    res.status(500).json({
      message: "Error deleting custom course",
      error: error.message,
    });
  }
};

// Create a new custom course
export const createCustom = async (req, res) => {
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

    // Create new custom course
    const custom = new Custom({
      title,
      description,
      instructor,
      poster,
      price,
      category,
      level,
      modules: parsedModules,
    });

    await custom.save();

    res.status(201).json({
      message: "Custom course created successfully",
      custom,
      success: true,
    });
  } catch (error) {
    console.error("Error creating custom course:", error);
    res.status(500).json({
      message: "Error creating custom course",
      error: error.message,
    });
  }
};

// Update an existing custom course
export const updateCustom = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customId } = req.params;
    const updateData = { ...req.body };

    // If there's a new image
    if (req.file) {
      // Delete old image from Cloudinary if exists
      const oldCustom = await Custom.findById(customId);
      if (oldCustom && oldCustom.poster) {
        const publicId = oldCustom.poster.split("/").pop().split(".")[0];
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

    const custom = await Custom.findOneAndUpdate(
      { _id: customId, instructor: req.user.userId },
      updateData,
      { new: true }
    );

    if (!custom) {
      return res.status(404).json({
        message: "Custom course not found or you're not authorized to update it",
      });
    }

    res.json({
      message: "Custom course updated successfully",
      custom,
    });
  } catch (error) {
    console.error("Error updating custom course:", error);
    res.status(500).json({
      message: "Error updating custom course",
      error: error.message,
    });
  }
};

// Enroll a user in a custom course
export const enrollCustom = async (req, res) => {
  try {
    // Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customId } = req.params;
    const userId = req.user.userId;

    // Find the custom course
    const custom = await Custom.findById(customId);
    if (!custom) {
      return res.status(404).json({
        message: "Custom course not found",
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if user is already enrolled in the custom course
    const isEnrolled = user.enrolledCourses.some(
      (enrollment) => enrollment.courseId.toString() === customId
    );

    if (isEnrolled) {
      return res.status(400).json({
        message: "You are already enrolled in this custom course",
      });
    }

    // Get the first module of the custom course, or null if no modules exist
    const firstModule =
      custom.modules.length > 0 ? custom.modules[0]._id : null;

    // Add custom course to user's enrolled courses with the updated structure
    user.enrolledCourses.push({
      courseId: customId,
      progress: 0, // Initialize progress to 0
      currentModule: firstModule, // Set the first module's ID (or null if no modules)
      videoProgress: {}, // Initialize an empty object to track video progress for each module
      completedModules: [], // Empty array to track completed modules (as ObjectIds)
    });

    // Add user to the custom course's enrolled students if not already added
    if (!custom.studentsEnrolled.includes(userId)) {
      custom.studentsEnrolled.push(userId);
    }

    // Save both user and custom course documents
    await Promise.all([user.save(), custom.save()]);

    // Send response to client
    res.json({
      success: true,
      message: "Successfully enrolled in the custom course",
      custom: {
        id: custom._id,
        title: custom.title,
        description: custom.description,
        instructor: custom.instructor,
        poster: custom.poster,
        level: custom.level,
        price: custom.price,
      },
    });
  } catch (error) {
    console.error("Error enrolling in custom course:", error);
    res.status(500).json({
      success: false,
      message: "Error enrolling in custom course",
      error: error.message,
    });
  }
};

// Get instructor's custom courses
export const getInstructorCustoms = async (req, res) => {
  try {
    const customs = await Custom.find({ instructor: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      message: "Instructor custom courses retrieved successfully",
      customs,
    });
  } catch (error) {
    console.error("Error getting instructor custom courses:", error);
    res.status(500).json({
      message: "Error getting instructor custom courses",
      error: error.message,
    });
  }
};

// Get all custom courses
export const getAllCustoms = async (req, res) => {
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

    const customs = await Custom.find(filter)
      .populate("instructor", "name avatar")
      .select(
        "title description poster price level category createdAt"
      );

    res.status(200).json({
      success: true,
      customs: customs.map((custom) => ({
        id: custom._id,
        title: custom.title,
        description: custom.description,
        instructor: custom.instructor.name,
        level: custom.level,
        category: custom.category,
        poster: custom.poster,
        price: custom.price,
      })),
    });
  } catch (error) {
    console.error("Error fetching custom courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch custom courses",
    });
  }
};