const mongoose = require("mongoose");

const testInvitationSchema = new mongoose.Schema(
  {
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
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    mcqPoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestMcqPool",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "expired"],
      default: "pending",
      index: true,
    },
    timeLimitMinutes: { type: Number, default: 30 },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.TestInvitation ||
  mongoose.model("TestInvitation", testInvitationSchema);