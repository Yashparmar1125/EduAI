import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  field: {
    type: String,
    required: true,
    trim: true,
  },
  skillsAssessed: [
    {
      type: String,
      required: true,
    },
  ],
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          text: String,
          isCorrect: Boolean,
        },
      ],
      skillCategory: String,
      difficultyLevel: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
      },
    },
  ],
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  totalAttempts: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
  },
  topSkillGaps: [
    {
      skill: String,
      gapPercentage: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
assessmentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;
