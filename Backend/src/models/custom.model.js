import mongoose from "mongoose";

// Define the custom module schema
const custommoduleSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  duration: { type: String },
  videoUrl: { type: String },
  resources: [{ name: String, link: String }],
  questions: [{ question: String, options: [String], answer: String }],
});

// Define the custom schema
const CustomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  modules: [custommoduleSchema],
  createdAt: { type: Date, default: Date.now },
  progress: [
    {
      moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      videoProgress: {
        type: Number,
        default: 0,
      },
      quizResults: {
        score: Number,
        total: Number,
        percentage: Number,
        answers: Object,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: Date,
    },
  ],
});

// Create the model
const Custom = mongoose.model("Custom", CustomSchema);

export default Custom;
