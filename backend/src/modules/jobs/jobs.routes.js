const express = require("express");
const router = express.Router();

const {
  createJob,
  listOpenJobs,
  listMyJobs,
  getJobById,
  closeJob,
} = require("./jobs.controller");

const verifyFirebaseToken = require("../../middleware/verifyFirebaseToken");
const requireRole = require("../../middleware/requireRole");

// IMPORTANT: specific routes before dynamic /:id route
router.get("/mine", verifyFirebaseToken, requireRole("hr"), listMyJobs);
router.get("/", listOpenJobs);
router.post("/", verifyFirebaseToken, requireRole("hr"), createJob);

router.get("/:id", getJobById);
router.patch("/:id/close", verifyFirebaseToken, requireRole("hr"), closeJob);

module.exports = router;