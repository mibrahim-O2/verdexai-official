const mongoose = require("mongoose");

// Tracks a hired candidate's onboarding progress after an Application
// reaches status "hired". Backs the HR "Hire Onboarding" and
// "Finalize Hire" pages.
const hirePipelineSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true, unique: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    jobPostId: { type: mongoose.Schema.Types.ObjectId, ref: "JobPost", required: true, index: true },
    startDate: { type: Date },
    steps: {
      offerLetterSent: { type: Boolean, default: false },
      offerAccepted: { type: Boolean, default: false },
      documentsSubmitted: { type: Boolean, default: false },
      itAccountSetup: { type: Boolean, default: false },
      firstDayScheduled: { type: Boolean, default: false },
    },
    notes: { type: String, default: "", maxlength: 2000 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.HirePipeline || mongoose.model("HirePipeline", hirePipelineSchema);