import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  price: { type: Number, default: 0 },
  category: { type: String },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model("Course", CourseSchema);
export default Course;
