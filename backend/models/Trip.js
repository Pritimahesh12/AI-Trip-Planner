const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    days: {
      type: Number,
      required: [true, "Number of days is required"],
      min: 1,
    },
    budget: {
      type: String,
      enum: ["cheap", "moderate", "luxury"],
      required: true,
    },
    travelers: {
      type: String,
      enum: ["solo", "couple", "family", "friends"],
      required: true,
    },
    aiResponse: {
      type: Object,
      required: true,
    },
     messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);