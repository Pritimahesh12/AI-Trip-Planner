const express = require("express");
const router = express.Router();
const { generateTrip } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/generate-trip", protect, generateTrip);

module.exports = router;