const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema(
  {
    hrId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    department: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, minlength: 10 },
    requirements: { type: String, required: true, trim: true, minlength: 5 },
    status: { type: String, enum: ["open", "closed"], default: "open", index: true },
  },
  { timestamps: true }
);

// Common query patterns: open jobs sorted by recency, and an HR user's own jobs
jobPostSchema.index({ status: 1, createdAt: -1 });
jobPostSchema.index({ hrId: 1, createdAt: -1 });

module.exports = mongoose.models.JobPost || mongoose.model("JobPost", jobPostSchema);