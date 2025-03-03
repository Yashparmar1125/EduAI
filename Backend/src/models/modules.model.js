import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }, // Module content (text, links, etc.)
    videoURL: { type: String }, // Firebase Storage link for module video
    quiz: [
      {
        question: String,
        options: [String],
        answer: String,
      },
    ], // Optional quizzes associated with the module
  },
  { timestamps: true }
);

const Module = mongoose.model('Module', moduleSchema);
export default Module;
