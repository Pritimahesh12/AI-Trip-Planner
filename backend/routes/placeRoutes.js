const express = require("express");
const router = express.Router();
const { getPhoto, getCoords, getPlaceDetailsHandler } = require("../controllers/placeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/photo", protect, getPhoto);
router.get("/coordinates", protect, getCoords);
router.get("/details", protect, getPlaceDetailsHandler);

module.exports = router;