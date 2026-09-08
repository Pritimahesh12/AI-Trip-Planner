const axios = require("axios");

const getPlacePhoto = async (query) => {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    const data = await response.json();

    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.medium;
    }

    return null; 
  } catch (error) {
    console.error("Pexels API error:", error.message);
    return null;
  }
};

const getCoordinates = async (address, fallbackQuery) => {
  try {
    let response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      { headers: { "User-Agent": "AI-Trip-Planner-App" } }
    );
    let data = await response.json();

    if ((!data || data.length === 0) && fallbackQuery) {
      response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fallbackQuery)}&format=json&limit=1`,
        { headers: { "User-Agent": "AI-Trip-Planner-App" } }
      );
      data = await response.json();
    }

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (error) {
    console.error("Nominatim API error:", error.message);
    return null;
  }
};

const getPlaceDetails = async (placeName, destination) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  const searchRes = await axios.get(
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
    {
      params: {
        input: `${placeName}, ${destination}`,
        inputtype: "textquery",
        fields: "place_id,geometry",
        key: apiKey,
      },
    }
  );

  const candidate = searchRes.data.candidates?.[0];
  if (!candidate) return { rating: null, reviews: [], alternatives: [] };

  const detailsRes = await axios.get(
    "https://maps.googleapis.com/maps/api/place/details/json",
    {
      params: {
        place_id: candidate.place_id,
        fields: "rating,user_ratings_total,reviews,types",
        key: apiKey,
      },
    }
  );

  const details = detailsRes.data.result || {};
  const reviews = (details.reviews || [])
    .slice(0, 2)
    .map((r) => ({ text: r.text?.slice(0, 200), rating: r.rating }));

  const placeType = details.types?.[0] || "tourist_attraction";
  const { lat, lng } = candidate.geometry.location;

  const nearbyRes = await axios.get(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    {
      params: {
        location: `${lat},${lng}`,
        radius: 5000,
        type: placeType,
        key: apiKey,
      },
    }
  );

  const alternatives = (nearbyRes.data.results || [])
    .filter((p) => p.name.toLowerCase() !== placeName.toLowerCase())
    .slice(0, 3)
    .map((p) => ({ name: p.name, rating: p.rating || null }));

  return {
    rating: details.rating || null,
    totalRatings: details.user_ratings_total || 0,
    reviews,
    alternatives,
  };
};

module.exports = { getPlacePhoto, getCoordinates, getPlaceDetails };
