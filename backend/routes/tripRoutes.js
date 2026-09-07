const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createTrip, getMyTrips, getTripById, deleteTrip, chatWithTrip } = require("../controllers/tripController");

router.post("/", protect, createTrip);
router.get("/", protect, getMyTrips);
router.get("/:id", protect, getTripById);
router.delete("/:id", protect, deleteTrip);
router.post("/:id/chat", protect, chatWithTrip);

module.exports = router;