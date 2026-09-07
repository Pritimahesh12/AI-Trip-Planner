const { chatGeneral } = require("../services/geminiService");

// @route  POST /api/chat/general  (protected)
exports.chatGeneralAssistant = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const conversationHistory = Array.isArray(history) ? history : [];
    const reply = await chatGeneral(conversationHistory, message);

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ message: "Failed to get chat response", error: error.message });
  }
};