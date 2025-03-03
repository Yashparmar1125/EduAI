import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String }, // Firebase Storage link for badge image
    awardedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    criteria: { type: String, required: true }, // Criteria to earn the badge
  },
  { timestamps: true }
);

const Badge = mongoose.model("Badge", badgeSchema);
export default Badge;
