import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "revoked", "expired"],
      default: "active",
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
certificateSchema.index({ userId: 1, courseId: 1 });
certificateSchema.index({ certificateNumber: 1 }, { unique: true });
certificateSchema.index({ status: 1 });

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
