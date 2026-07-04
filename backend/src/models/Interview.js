const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },
    hrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewDate: { type: Date, required: true },
    durationMinutes: { type: Number, default: 30 },
    meetingLink: { type: String, default: "" },
    meetingPlatform: {
      type: String,
      enum: ["Google Meet", "Zoom", "Microsoft Teams", "Other"],
      default: "Google Meet",
    },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Interview ||
  mongoose.model("Interview", interviewSchema);