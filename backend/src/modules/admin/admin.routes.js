const express = require("express");
const router = express.Router();

const {
  getStats,
  listHrAccounts,
  listCandidates,
  toggleSuspend,
  changeRole,
} = require("./admin.controller");

const verifyFirebaseToken = require("../../middleware/verifyFirebaseToken");
const requireRole = require("../../middleware/requireRole");

router.use(verifyFirebaseToken, requireRole("admin"));

router.get("/stats", getStats);
router.get("/hr-accounts", listHrAccounts);
router.get("/candidates", listCandidates);
router.patch("/users/:id/suspend", toggleSuspend);
router.patch("/users/:id/role", changeRole);

module.exports = router;