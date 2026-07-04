const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    jobPostId: { type: mongoose.Schema.Types.ObjectId, ref: "JobPost", required: true, index: true },
    coverLetter: { type: String, default: "", maxlength: 4000 },
    cvUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["submitted", "under_review", "shortlisted", "interview_scheduled", "rejected", "hired"],
      default: "submitted",
      index: true,
    },
    parsedCv: {
      name: String,
      email: String,
      phone: String,
      skills: [String],
      experienceYears: Number,
      education: String,
      summary: String,
    },
    aiScore: { type: Number, default: null, min: 0, max: 100 },
    aiReasoning: { type: String, default: "", maxlength: 1000 },
  },
  { timestamps: true }
);

// A candidate can only apply once per job
applicationSchema.index({ candidateId: 1, jobPostId: 1 }, { unique: true });

// Common query patterns: HR ranking by score, candidate's own application list
applicationSchema.index({ jobPostId: 1, aiScore: -1 });
applicationSchema.index({ candidateId: 1, createdAt: -1 });

module.exports = mongoose.models.Application || mongoose.model("Application", applicationSchema);