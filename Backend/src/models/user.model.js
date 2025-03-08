import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    uid: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["student", "instructor"], default: "student" },
    profilePicture: { type: String }, // URL to Firebase Storage
    skills: [{ type: String }], // Skills for AI learning path
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
    enrolledCourses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        progress: { type: Number, default: 0 }, // Percentage
        currentModule: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Module",
          default: null,
        }, // Change this to an ObjectId referencing a Module
        videoProgress: { type: Map, of: Number, default: {} }, // Change this to a Map of Numbers for each module
        completedModules: [
          { type: mongoose.Schema.Types.ObjectId, ref: "Module" }, // Store completed modules as ObjectIds
        ],
        certificateUrl: { type: String, default: null },
      },
    ],
    completedCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Certificate" },
    ],
    certificates: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Certificate" },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
