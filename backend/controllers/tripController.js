const Trip = require("../models/Trip");

exports.createTrip = async (req, res) => {
  try {
    const { destination, days, budget, travelers, aiResponse } = req.body;

    if (!destination || !days || !budget || !travelers || !aiResponse) {
      return res.status(400).json({ message: "All trip fields are required" });
    }

    const trip = await Trip.create({
      userId: req.user.id,
      destination,
      days,
      budget,
      travelers,
      aiResponse,
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this trip" });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  DELETE /api/trips/:id  (protected)
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this trip" });
    }

    await trip.deleteOne();

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};