import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    uid: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "instructor"], default: "student" },
    profilePicture: { type: String }, // URL to Firebase Storage
    skills: [{ type: String }], // Skills for AI learning path
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
    enrolledCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment" },
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
