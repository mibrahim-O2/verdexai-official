const express = require("express");
const router = express.Router();

const {
  inviteCandidate,
  getMyInvitations,
  getTestQuestions,
  submitTest,
  getResult,
  getJobResults,
} = require("./assessment.controller");

const {
  scheduleInterview,
  getMyInterviews,
  getHrInterviews,
  updateInterviewStatus,
} = require("./interview.controller");

const verifyFirebaseToken = require("../../middleware/verifyFirebaseToken");
const requireRole = require("../../middleware/requireRole");

// Assessment/Test routes
router.post("/invite", verifyFirebaseToken, requireRole("hr"), inviteCandidate);
router.get("/job-results/:jobId", verifyFirebaseToken, requireRole("hr"), getJobResults);
router.get("/my-invitations", verifyFirebaseToken, requireRole("candidate"), getMyInvitations);
router.get("/invitation/:id/questions", verifyFirebaseToken, requireRole("candidate"), getTestQuestions);
router.post("/submit", verifyFirebaseToken, requireRole("candidate"), submitTest);
router.get("/results/:invitationId", verifyFirebaseToken, requireRole("candidate"), getResult);

// Interview scheduling routes
router.post("/interview/schedule", verifyFirebaseToken, requireRole("hr"), scheduleInterview);
router.get("/interview/my", verifyFirebaseToken, requireRole("candidate"), getMyInterviews);
router.get("/interview/hr", verifyFirebaseToken, requireRole("hr"), getHrInterviews);
router.patch("/interview/:id/status", verifyFirebaseToken, requireRole("hr"), updateInterviewStatus);

module.exports = router;