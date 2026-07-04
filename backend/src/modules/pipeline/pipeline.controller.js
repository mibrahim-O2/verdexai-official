const HirePipeline = require("../../models/HirePipeline");
const Application = require("../../models/Application");
const JobPost = require("../../models/JobPost");
const asyncHandler = require("../../utils/asyncHandler");

// GET /api/v1/pipeline/ready-to-hire
// Returns applications with status shortlisted or interview_scheduled for this HR's jobs
const getReadyToHire = asyncHandler(async (req, res) => {
  const myJobs = await JobPost.find({ hrId: req.user._id }).select("_id");
  const jobIds = myJobs.map((j) => j._id);

  const applications = await Application.find({
    jobPostId: { $in: jobIds },
    status: { $in: ["shortlisted", "interview_scheduled"] },
  })
    .populate("candidateId", "name email")
    .populate("jobPostId", "title department")
    .sort({ aiScore: -1 });

  res.json({ success: true, applications });
});

// POST /api/v1/pipeline/finalize
// Marks an application as hired + creates a HirePipeline entry
const finalizeHire = asyncHandler(async (req, res) => {
  const { applicationId, startDate } = req.body;

  if (!applicationId) {
    return res.status(400).json({ success: false, error: "applicationId is required." });
  }

  const application = await Application.findById(applicationId).populate("jobPostId");
  if (!application) {
    return res.status(404).json({ success: false, error: "Application not found." });
  }

  if (application.jobPostId.hrId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: "Not authorized." });
  }

  // Check not already hired
  const existing = await HirePipeline.findOne({ applicationId });
  if (existing) {
    return res.status(409).json({ success: false, error: "This candidate has already been finalized." });
  }

  // Update application status
  application.status = "hired";
  await application.save();

  // Create pipeline entry
  const pipeline = await HirePipeline.create({
    applicationId,
    candidateId: application.candidateId,
    jobPostId: application.jobPostId._id,
    startDate: startDate ? new Date(startDate) : null,
  });

  res.status(201).json({ success: true, pipeline });
});

// GET /api/v1/pipeline/onboarding
// Returns all HirePipeline entries for this HR's jobs
const getOnboarding = asyncHandler(async (req, res) => {
  const myJobs = await JobPost.find({ hrId: req.user._id }).select("_id");
  const jobIds = myJobs.map((j) => j._id);

  const pipelines = await HirePipeline.find({ jobPostId: { $in: jobIds } })
    .populate("candidateId", "name email")
    .populate("jobPostId", "title department")
    .sort({ createdAt: -1 });

  res.json({ success: true, pipelines });
});

// PATCH /api/v1/pipeline/:id/step
// Toggles a single onboarding step for a pipeline entry
const updateStep = asyncHandler(async (req, res) => {
  const { step, value } = req.body;

  const validSteps = [
    "offerLetterSent",
    "offerAccepted",
    "documentsSubmitted",
    "itAccountSetup",
    "firstDayScheduled",
  ];

  if (!validSteps.includes(step)) {
    return res.status(400).json({ success: false, error: "Invalid step name." });
  }

  const pipeline = await HirePipeline.findById(req.params.id).populate("jobPostId");
  if (!pipeline) {
    return res.status(404).json({ success: false, error: "Pipeline entry not found." });
  }

  if (pipeline.jobPostId.hrId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: "Not authorized." });
  }

  pipeline.steps[step] = typeof value === "boolean" ? value : !pipeline.steps[step];
  await pipeline.save();

  res.json({ success: true, pipeline });
});

// GET /api/v1/pipeline/my-onboarding   (Candidate only)
const getMyCandidateOnboarding = asyncHandler(async (req, res) => {
  const pipelines = await HirePipeline.find({ candidateId: req.user._id })
    .populate("jobPostId", "title department")
    .sort({ createdAt: -1 });

  res.json({ success: true, pipelines });
});

module.exports = {
  getReadyToHire,
  finalizeHire,
  getOnboarding,
  updateStep,
  getMyCandidateOnboarding,
};