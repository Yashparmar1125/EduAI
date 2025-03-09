import mongoose from "mongoose";

const custommoduleSchema = new mongoose.Schema({
  title: String,
  content: String,
  videoUrl: String,
});

const CustomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String, required: false },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  modules: [custommoduleSchema],
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  price: { type: Number, default: 0 },
  category: { type: String },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  createdAt: { type: Date, default: Date.now }
});

const Custom = mongoose.model("Custom", CustomSchema);
export default Custom;
