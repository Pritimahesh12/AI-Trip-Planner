
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

module.exports = { getPlacePhoto, getCoordinates };
