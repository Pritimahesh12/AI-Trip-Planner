const { generateTripPlan } = require("../services/geminiService");

// @route  POST /api/ai/generate-trip  (protected)
exports.generateTrip = async (req, res) => {
  try {
    const { destination, days, budget, travelers } = req.body;

    if (!destination || !days || !budget || !travelers) {
      return res.status(400).json({ message: "All trip fields are required" });
    }

    const aiResponse = await generateTripPlan({
      destination,
      days,
      budget,
      travelers,
    });

    res.status(200).json({
      destination,
      days,
      budget,
      travelers,
      aiResponse,
    });
  } catch (error) {
    console.error("AI generation error:", error.message);  
    res.status(500).json({
      message: "Failed to generate trip",
      error: error.message,
    });
  }
};