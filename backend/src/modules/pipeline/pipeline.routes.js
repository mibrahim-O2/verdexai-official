const express = require("express");
const router = express.Router();

const {
  getReadyToHire,
  finalizeHire,
  getOnboarding,
  updateStep,
  getMyCandidateOnboarding,
} = require("./pipeline.controller");

const verifyFirebaseToken = require("../../middleware/verifyFirebaseToken");
const requireRole = require("../../middleware/requireRole");

// HR routes
router.get("/ready-to-hire", verifyFirebaseToken, requireRole("hr"), getReadyToHire);
router.post("/finalize", verifyFirebaseToken, requireRole("hr"), finalizeHire);
router.get("/onboarding", verifyFirebaseToken, requireRole("hr"), getOnboarding);
router.patch("/:id/step", verifyFirebaseToken, requireRole("hr"), updateStep);

// Candidate routes
router.get("/my-onboarding", verifyFirebaseToken, requireRole("candidate"), getMyCandidateOnboarding);

module.exports = router;