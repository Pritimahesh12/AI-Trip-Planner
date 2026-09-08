const { getPlacePhoto, getCoordinates, getPlaceDetails } = require("../services/placeService");

exports.getPhoto = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const photoUrl = await getPlacePhoto(query);

    res.set("Cache-Control", "no-store"); 

    res.status(200).json({ photoUrl });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch photo", error: error.message });
  }
};

exports.getCoords = async (req, res) => {
  try {
    const { address, fallback } = req.query;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const coords = await getCoordinates(address, fallback);

    res.set("Cache-Control", "no-store"); 
    res.status(200).json({ coordinates: coords });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coordinates", error: error.message });
  }
};

exports.getPlaceDetailsHandler = async (req, res) => {
  try {
    const { query, destination } = req.query;
    if (!query) {
      return res.status(400).json({ message: "query is required" });
    }
    const details = await getPlaceDetails(query, destination || "");
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch place details", error: error.message });
  }
};
