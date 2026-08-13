require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const tripRoutes = require("./routes/tripRoutes");
const placesRoutes = require("./routes/placeRoutes");

const app = express();

connectDB();

app.use(cors({ origin: [
    'https://ai-trip-planner-b5zs.vercel.app', 
    'http://localhost:5173'         
  ],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "AI Trip Planner API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/places", placesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});