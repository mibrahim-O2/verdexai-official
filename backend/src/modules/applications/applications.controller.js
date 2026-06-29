const Application = require("../../models/Application");
const JobPost = require("../../models/JobPost");
const asyncHandler = require("../../utils/asyncHandler");
const { extractTextFromPdf, parseCvText, scoreCandidateAgainstJob } = require("../../modules/ai/ai.service");

// POST /api/v1/applications   (Candidate only, multipart/form-data with "cv" file field)
const submitApplication = asyncHandler(async (req, res) => {
  const { jobPostId, coverLetter } = req.body;

  if (!jobPostId) {
    return res.status(400).json({ success: false, error: "jobPostId is required." });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, error: "CV file (PDF) is required." });
  }

  const job = await JobPost.findById(jobPostId);
  if (!job || job.status !== "open") {
    return res.status(404).json({ success: false, error: "Job not found or no longer open." });
  }

  const existing = await Application.findOne({ candidateId: req.user._id, jobPostId });
  if (existing) {
    return res.status(409).json({ success: false, error: "You have already applied to this job." });
  }

  let parsedCv = null;
  let aiScore = null;
  let aiReasoning = "";

  try {
    const cvText = await extractTextFromPdf(req.file.buffer);
    parsedCv = await parseCvText(cvText);
    const scoring = await scoreCandidateAgainstJob(parsedCv, job);
    aiScore = scoring.score;
    aiReasoning = scoring.reasoning;
  } catch (err) {
    console.error("AI processing failed during application submission:", err.message);
    // Application still gets created even if AI parsing fails — HR can review manually
  }

  const application = await Application.create({
    candidateId: req.user._id,
    jobPostId,
    coverLetter: coverLetter || "",
    parsedCv,
    aiScore,
    aiReasoning,
  });

  res.status(201).json({ success: true, application });
});

// GET /api/v1/applications/mine   (Candidate only)
const listMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidateId: req.user._id })
    .populate("jobPostId", "title department status")
    .sort({ createdAt: -1 });

  res.json({ success: true, applications });
});

// GET /api/v1/applications/job/:jobId   (HR only — applicants for one of their jobs, ranked by AI score)
const listApplicationsForJob = asyncHandler(async (req, res) => {
  const job = await JobPost.findById(req.params.jobId);
  if (!job) {
    return res.status(404).json({ success: false, error: "Job not found." });
  }
  if (job.hrId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: "Not authorized to view these applications." });
  }

  const applications = await Application.find({ jobPostId: req.params.jobId })
    .populate("candidateId", "name email")
    .sort({ aiScore: -1 });

  res.json({ success: true, applications });
});

// GET /api/v1/applications/ranked   (HR only — all applicants across all their jobs, ranked)
const listAllRankedForHr = asyncHandler(async (req, res) => {
  const myJobs = await JobPost.find({ hrId: req.user._id }).select("_id");
  const jobIds = myJobs.map((j) => j._id);

  const applications = await Application.find({ jobPostId: { $in: jobIds } })
    .populate("candidateId", "name email")
    .populate("jobPostId", "title")
    .sort({ aiScore: -1 });

  res.json({ success: true, applications });
});

// PATCH /api/v1/applications/:id/status   (HR only)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["submitted", "under_review", "shortlisted", "interview_scheduled", "rejected", "hired"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status value." });
  }

  const application = await Application.findById(req.params.id).populate("jobPostId");
  if (!application) {
    return res.status(404).json({ success: false, error: "Application not found." });
  }
  if (application.jobPostId.hrId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: "Not authorized to modify this application." });
  }

  application.status = status;
  await application.save();

  res.json({ success: true, application });
});

module.exports = {
  submitApplication,
  listMyApplications,
  listApplicationsForJob,
  listAllRankedForHr,
  updateApplicationStatus,
};