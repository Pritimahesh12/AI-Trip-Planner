import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import useUserLocation from "../../hooks/useUserLocation";
import { calculateDistance } from "../../utils/distance";
import "./CreateTrip.css";

function CreateTrip() {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "moderate",
    travelers: "solo",
  });
  const [trip, setTrip] = useState(null);
  const [photos, setPhotos] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { location, error: locationError } = useUserLocation();
  const [coordinates, setCoordinates] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setTrip(null);
    setPhotos({});
    setSaved(false);
    setLoading(true);

    try {
      const res = await axiosInstance.post("/ai/generate-trip", formData);
      setTrip(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.post("/trips", trip);
      setSaved(true);
    } catch (err) {
      setError("Failed to save trip. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!trip) return;

    const fetchAllPhotos = async () => {
      const newPhotos = {};

      for (const hotel of trip.aiResponse.hotels) {
        try {
          const res = await axiosInstance.get(
            `/places/photo?query=${encodeURIComponent(hotel.name + " hotel")}`
          );
          newPhotos[hotel.name] = res.data.photoUrl;
        } catch (err) {
          newPhotos[hotel.name] = null;
        }
      }

      for (const dayPlan of trip.aiResponse.itinerary) {
        for (const place of dayPlan.places) {
          try {
            const res = await axiosInstance.get(
              `/places/photo?query=${encodeURIComponent(place.name)}`
            );
            newPhotos[place.name] = res.data.photoUrl;
          } catch (err) {
            newPhotos[place.name] = null;
          }
        }
      }

      setPhotos(newPhotos);
    };

    fetchAllPhotos();
  }, [trip]);

  useEffect(() => {
    if (!trip) return;

    const fetchAllCoordinates = async () => {
      const newCoords = {};

      for (const hotel of trip.aiResponse.hotels) {
        try {
          const res = await axiosInstance.get(
            `/places/coordinates?address=${encodeURIComponent(hotel.address)}&fallback=${encodeURIComponent(trip.destination)}`
          );
          newCoords[hotel.name] = res.data.coordinates;
        } catch (err) {
          newCoords[hotel.name] = null;
        }
      }

      for (const dayPlan of trip.aiResponse.itinerary) {
        for (const place of dayPlan.places) {
          try {
            const res = await axiosInstance.get(
              `/places/coordinates?address=${encodeURIComponent(place.name + ", " + trip.destination)}&fallback=${encodeURIComponent(trip.destination)}`
            );
            newCoords[place.name] = res.data.coordinates;
          } catch (err) {
            newCoords[place.name] = null;
          }
        }
      }

      setCoordinates(newCoords);
    };

    fetchAllCoordinates();
  }, [trip]);

  return (
    <div className="createtrip-page">
      <Navbar />

      <div className="createtrip-container">
        <h1>Plan your next trip</h1>
        <p className="createtrip-subtitle">
          Tell us your preferences and let AI build your itinerary
        </p>

        <form className="trip-form" onSubmit={handleGenerate}>
          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              name="destination"
              placeholder="e.g. Goa, Paris, Manali"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Number of Days</label>
            <input
              type="number"
              name="days"
              placeholder="e.g. 3"
              min="1"
              max="14"
              value={formData.days}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Budget</label>
            <select name="budget" value={formData.budget} onChange={handleChange}>
              <option value="cheap">Cheap</option>
              <option value="moderate">Moderate</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div className="form-group">
            <label>Travelers</label>
            <select name="travelers" value={formData.travelers} onChange={handleChange}>
              <option value="solo">Solo</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
            </select>
          </div>

          <button type="submit" className="generate-btn" disabled={loading}>
            {loading ? "Generating your trip..." : "Generate Trip with AI"}
          </button>
        </form>

        {error && <div className="createtrip-error">{error}</div>}

        {loading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>AI is building your itinerary, this may take a few seconds...</p>
          </div>
        )}

        {trip && !loading && (
          <div className="trip-result">
            <div className="trip-result-header">
              <h2>{trip.destination} — {trip.days} Days</h2>
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={saving || saved}
              >
                {saved ? "Saved ✓" : saving ? "Saving..." : "Save Trip"}
              </button>
            </div>

            {/* Hotels */}
            <h3 className="section-title">Suggested Hotels</h3>
            <div className="hotels-grid">
              {trip.aiResponse.hotels.map((hotel, index) => (
                <a href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(hotel.name + ", " + hotel.address)} target="_blank" rel="noopener noreferrer" className="hotel-card" key={index}>
                  {photos[hotel.name] ? (
                    <img
                      src={photos[hotel.name]}
                      alt={hotel.name}
                      className="hotel-image"
                    />
                  ) : (
                    <div className="hotel-image-placeholder">
                      <div className="mini-spinner"></div>
                    </div>
                  )}
                  <div className="hotel-content">
                    <h4>{hotel.name}</h4>
                    <p className="hotel-address">📍 {hotel.address}</p>
                      {location && coordinates[hotel.name] && (
                        <p className="distance-badge">
                           {calculateDistance(
                            location.lat,
                            location.lng,
                            coordinates[hotel.name].lat,
                            coordinates[hotel.name].lng
                          )} km from you
                        </p>
                      )}
                    
                    <p className="hotel-price">{hotel.priceRange}</p>
                    <p className="hotel-desc">{hotel.description}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Itinerary */}
            <h3 className="section-title">Day-by-Day Itinerary</h3>
            {trip.aiResponse.itinerary.map((dayPlan) => (
              <div className="day-block" key={dayPlan.day}>
                <h4 className="day-title">Day {dayPlan.day}</h4>
                <div className="places-grid">
                  {dayPlan.places.map((place, index) => (
                    <a href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place.name + ", " + trip.destination)} target="_blank" rel="noopener noreferrer" className="place-card" key={index}>
                      {photos[place.name] ? (
                        <img
                          src={photos[place.name]}
                          alt={place.name}
                          className="place-image"
                        />
                      ) : (
                        <div className="place-image-placeholder">
                          <div className="mini-spinner"></div>
                        </div>
                      )}
                      <div className="place-content">
                        <span className="place-time">🕒 {place.time}</span>
                        <h5>{place.name}</h5>
                        {location && coordinates[place.name] && (
                          <p className="distance-badge">
                             {calculateDistance(
                              location.lat,
                              location.lng,
                              coordinates[place.name].lat,
                              coordinates[place.name].lng
                            )} km from you
                          </p>
                        )}
                        <p>{place.details}</p>
                        <span className="place-price">{place.ticketPrice}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default CreateTrip;