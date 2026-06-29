const express = require("express");
const router = express.Router();

const {
  submitApplication,
  listMyApplications,
  listApplicationsForJob,
  listAllRankedForHr,
  updateApplicationStatus,
} = require("./applications.controller");

const verifyFirebaseToken = require("../../middleware/verifyFirebaseToken");
const requireRole = require("../../middleware/requireRole");
const uploadCv = require("../../middleware/uploadCv");

router.post(
  "/",
  verifyFirebaseToken,
  requireRole("candidate"),
  uploadCv.single("cv"),
  submitApplication
);
router.get("/mine", verifyFirebaseToken, requireRole("candidate"), listMyApplications);
router.get("/ranked", verifyFirebaseToken, requireRole("hr"), listAllRankedForHr);
router.get("/job/:jobId", verifyFirebaseToken, requireRole("hr"), listApplicationsForJob);
router.patch("/:id/status", verifyFirebaseToken, requireRole("hr"), updateApplicationStatus);

module.exports = router;