const express = require("express");
const router = express.Router();
const { getPhoto, getCoords } = require("../controllers/placeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/photo", protect, getPhoto);
router.get("/coordinates", protect, getCoords);

module.exports = router;