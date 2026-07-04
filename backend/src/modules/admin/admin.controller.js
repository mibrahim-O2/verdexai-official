const User = require("../../models/User");
const JobPost = require("../../models/JobPost");
const Application = require("../../models/Application");
const asyncHandler = require("../../utils/asyncHandler");

// GET /api/v1/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const [totalCandidates, totalHr, totalJobs, totalApplications] = await Promise.all([
    User.countDocuments({ role: "candidate" }),
    User.countDocuments({ role: "hr" }),
    JobPost.countDocuments(),
    Application.countDocuments(),
  ]);

  res.json({ success: true, stats: { totalCandidates, totalHr, totalJobs, totalApplications } });
});

// GET /api/v1/admin/hr-accounts
const listHrAccounts = asyncHandler(async (req, res) => {
  const hrUsers = await User.find({ role: "hr" }).sort({ createdAt: -1 });
  res.json({ success: true, users: hrUsers });
});

// GET /api/v1/admin/candidates
const listCandidates = asyncHandler(async (req, res) => {
  const candidates = await User.find({ role: "candidate" }).sort({ createdAt: -1 });
  res.json({ success: true, users: candidates });
});

// PATCH /api/v1/admin/users/:id/suspend
const toggleSuspend = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found." });
  }
  if (user.role === "admin") {
    return res.status(403).json({ success: false, error: "Cannot suspend admin accounts." });
  }

  user.suspended = !user.suspended;
  await user.save();

  res.json({ success: true, user });
});

// PATCH /api/v1/admin/users/:id/role
const changeRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["candidate", "hr"].includes(role)) {
    return res.status(400).json({ success: false, error: "Role must be candidate or hr." });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found." });
  }

  user.role = role;
  await user.save();

  res.json({ success: true, user });
});

module.exports = { getStats, listHrAccounts, listCandidates, toggleSuspend, changeRole };