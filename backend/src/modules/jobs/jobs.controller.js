const JobPost = require("../../models/JobPost");
const asyncHandler = require("../../utils/asyncHandler");

// POST /api/v1/jobs   (HR only)
const createJob = asyncHandler(async (req, res) => {
  const { title, department, description, requirements } = req.body;

  if (!title || !department || !description || !requirements) {
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  const job = await JobPost.create({
    hrId: req.user._id,
    title,
    department,
    description,
    requirements,
  });

  res.status(201).json({ success: true, job });
});

// GET /api/v1/jobs   (public — candidates browse open jobs)
const listOpenJobs = asyncHandler(async (req, res) => {
  const jobs = await JobPost.find({ status: "open" }).sort({ createdAt: -1 });
  res.json({ success: true, jobs });
});

// GET /api/v1/jobs/mine   (HR only — their own job posts)
const listMyJobs = asyncHandler(async (req, res) => {
  const jobs = await JobPost.find({ hrId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, jobs });
});

// GET /api/v1/jobs/:id   (public — single job detail)
const getJobById = asyncHandler(async (req, res) => {
  const job = await JobPost.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, error: "Job not found." });
  }
  res.json({ success: true, job });
});

// PATCH /api/v1/jobs/:id/close   (HR only — close their own job post)
const closeJob = asyncHandler(async (req, res) => {
  const job = await JobPost.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, error: "Job not found." });
  }
  if (job.hrId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: "Not authorized to modify this job." });
  }
  job.status = "closed";
  await job.save();
  res.json({ success: true, job });
});

module.exports = { createJob, listOpenJobs, listMyJobs, getJobById, closeJob };