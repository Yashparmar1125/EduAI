import User from "../models/user.model.js";
import path from "path";
import firebaseAdmin from "firebase-admin";

import { fileURLToPath } from "url";

// Get the current directory of the module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// utils
import { createToken, verifyToken } from "../utils/jwt.util.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
      password: hashedPassword,
    });

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

export const googleLogin = async (req, res) => {
  try {
    const { auth_token } = req.body;
    // Verify the Firebase ID token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(auth_token);
    const uid = decodedToken.uid; // Firebase user UID

    // Get user details from Firebase (optional)
    const user = await User.findById(uid).select("-password");
    const token = createToken(user._id);

    // Respond with user data or JWT, etc.
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
    console.error("Error verifying Firebase ID token:", error);
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export const googleRegister = async (req, res) => {
  try {
    const { auth_token } = req.body;
    // Verify the Firebase ID token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(auth_token);
    const uid = decodedToken.uid; // Firebase user UID

    // Check if the user already exists in the database
    let user = await User.findOne({ uid: uid });

    if (!user) {
      // User doesn't exist, so create a new user
      user = new User({
        uid: uid,
        email: decodedToken.email, // You can store more details like email, name, etc.
        name: decodedToken.name,
        profilePicture: decodedToken.picture, // Optional: If you want to store user's photo URL
      });

      // Save the user to the database
      await user.save();
    }

    // Create JWT token
    const token = createToken(user._id);

    // Respond with user data and JWT
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true, // Prevents access to cookie via JavaScript
        sameSite: "strict", // Ensures cookies are sent only in same-origin requests
      })
      .json({
        message: "User registered and logged in successfully",
        user,
        success: true,
      });
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};
