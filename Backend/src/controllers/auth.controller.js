import { User } from "../models/user.model.js";
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";

// Get the current directory of the module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// utils
import { createToken, verifyToken } from "../utils/jwt.util.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const file = req.file;

    // Define the public directory and the uploads folder
    const publicDir = path.join(__dirname, "..", "public");
    const uploadDir = path.join(publicDir, "uploads");

    // Ensure the 'public/uploads' directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let filePath = null;

    if (file) {
      // Sanitize file name to avoid security risks (e.g., directory traversal)
      const sanitizedFileName = path.basename(file.originalname);
      const uploadPath = path.join(uploadDir, sanitizedFileName); // Save path in public/uploads
      filePath = `/uploads/${sanitizedFileName}`; // URL path for access

      // Save the file buffer to disk
      fs.writeFileSync(uploadPath, file.buffer); // Writing the file data to the 'uploads' directory
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered", success: false });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const user = new User({
      name,
      email,
      role,
      phone,
      password: hashedPassword,
    });

    // Save the user to the database
    user.profile.profilePhoto = filePath;
    await user.save();

    // Create a JWT token
    const token = createToken(user._id);

    // Send the token in the cookie with proper settings
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true, // Prevents access to cookie via JavaScript
        sameSite: "strict", // Ensures cookies are sent only in same-origin requests
      })
      .json({
        message: "User registered successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid Credentials", success: false });
    }

    // Compare the provided password with the hashed password in the database
    const check = await comparePassword(password, user.password);
    if (!check) {
      return res
        .status(401)
        .json({ message: "Invalid Credentials", success: false });
    }

    // Create a JWT token
    const token = createToken(user._id);
    delete user.password;

    // Send the token in the cookie with proper settings
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true, // Prevents access to cookie via JavaScript
        sameSite: "strict", // Ensures cookies are sent only in same-origin requests
      })
      .json({
        message: "Logged in successfully",
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out Sucessfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, email, profile } = req.body;
    const userId = req.user.userId;

    // Find user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User Not Found", success: false });
    }

    // Update the basic fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;

    // Check if profile exists and update profile fields
    if (profile) {
      if (profile.bio) user.profile.bio = profile.bio; // Update bio
      if (profile.skills) user.profile.skills = profile.skills; // Update skills
    }

    // Save the updated user data
    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const profile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
