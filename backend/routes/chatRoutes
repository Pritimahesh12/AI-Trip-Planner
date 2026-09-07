const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { chatGeneralAssistant } = require("../controllers/chatController");

router.post("/general", protect, chatGeneralAssistant);

module.exports = router;