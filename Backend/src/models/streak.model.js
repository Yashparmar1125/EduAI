import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    daysActive: { type: Number, default: 0 },
    lastStreakReset: { type: Date, default: Date.now }, // Optionally reset streaks periodically (e.g., monthly)
  },
  { timestamps: true }
);

const Streak = mongoose.model('Streak', streakSchema);
export default Streak;
