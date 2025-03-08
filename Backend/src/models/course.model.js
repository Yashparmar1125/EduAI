import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: String,
  content: String,
  videoUrl: String,
  quiz: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  modules: [moduleSchema],
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  price: { type: Number, default: 0 },
  category: { type: String },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model("Course", CourseSchema);
export default Course;
