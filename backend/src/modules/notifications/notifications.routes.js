const express = require("express");
const router = express.Router();
const { submitContact } = require("./notifications.controller");

router.post("/contact", submitContact);

module.exports = router;