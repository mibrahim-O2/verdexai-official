const { auth } = require("../../config/firebase");
const User = require("../../models/User");
const asyncHandler = require("../../utils/asyncHandler");

// POST /api/v1/auth/register
// Called AFTER the frontend has already created the user in Firebase.
// This syncs that user into our MongoDB with a role.
const register = asyncHandler(async (req, res) => {
  const { idToken, name, role } = req.body;

  if (!idToken || !name) {
    return res.status(400).json({ success: false, error: "idToken and name are required." });
  }

  const decoded = await auth.verifyIdToken(idToken);

  const existing = await User.findOne({ firebaseUid: decoded.uid });
  if (existing) {
    return res.status(409).json({ success: false, error: "User already registered." });
  }

  const user = await User.create({
    firebaseUid: decoded.uid,
    name,
    email: decoded.email,
    role: role === "hr" ? "hr" : "candidate", // admins are seeded manually, not via signup
  });

  res.status(201).json({ success: true, user });
});

// POST /api/v1/auth/sync
// Called after login to fetch (or lazily create) the matching Mongo user.
const sync = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ success: false, error: "idToken is required." });
  }

  const decoded = await auth.verifyIdToken(idToken);

  const user = await User.findOne({ firebaseUid: decoded.uid });
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found. Please sign up first." });
  }

  res.json({ success: true, user });
});

// GET /api/v1/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { register, sync, me };