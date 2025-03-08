import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["COURSE_COMPLETION", "STREAK", "TIME_SPENT"],
      required: true,
    },
    requirement: {
      type: Number,
      required: true,
    },
    xpReward: {
      type: Number,
      required: true,
      default: 0,
    },
    icon: {
      type: String,
      required: true,
    },
    rarity: {
      type: String,
      enum: ["common", "uncommon", "rare", "epic"],
      default: "common",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
