const express = require("express");
const router = express.Router();

const { register, sync, me } = require("./auth.controller");
const verifyFirebaseToken = require("../../middleware/verifyFirebaseToken");

router.post("/register", register);
router.post("/sync", sync);
router.get("/me", verifyFirebaseToken, me);

module.exports = router;