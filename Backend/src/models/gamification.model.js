import mongoose from "mongoose";

const gamificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    rank: { type: String, default: "Newbie" },
    achievements: [
      {
        name: String,
        unlockedAt: Date,
      },
    ],
    streak: { type: Number, default: 0 }, // Daily login streak
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const Gamification = mongoose.model("Gamification", gamificationSchema);
export default Gamification;
