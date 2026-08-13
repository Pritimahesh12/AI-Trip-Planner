import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import useUserLocation from "../../hooks/useUserLocation";
import { calculateDistance } from "../../utils/distance";
import "./ViewTrip.css";

function ViewTrip() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coordinates, setCoordinates] = useState({});
  const { location } = useUserLocation();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axiosInstance.get(`/trips/${id}`);
        setTrip(res.data);
      } catch (err) {
        setError("Failed to load this trip. It may not exist or you don't have access.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

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
    <div className="viewtrip-page">
      <Navbar />

      <div className="viewtrip-container">
        {loading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Loading your trip...</p>
          </div>
        )}

        {error && (
          <div className="viewtrip-error">
            <p>{error}</p>
            <Link to="/my-trips" className="back-link">← Back to Saved Trips</Link>
          </div>
        )}

        {trip && !loading && (
          <div className="trip-result">
            <Link to="/my-trips" className="back-link">← Back to Saved Trips</Link>

            <div className="trip-result-header">
              <h2>{trip.destination} — {trip.days} Days</h2>
              <div className="trip-card-tags">
                <span className="tag">{trip.budget}</span>
                <span className="tag">{trip.travelers}</span>
              </div>
            </div>

            {/* Hotels */}
            <h3 className="section-title">Suggested Hotels</h3>
            <div className="hotels-grid">
              {trip.aiResponse.hotels.map((hotel, index) => (
                <div className="hotel-card" key={index}>
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
                    <p className="hotel-price">{hotel.priceRange}</p>
                    <p className="hotel-desc">{hotel.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Itinerary */}
            <h3 className="section-title">Day-by-Day Itinerary</h3>
            {trip.aiResponse.itinerary.map((dayPlan) => (
              <div className="day-block" key={dayPlan.day}>
                <h4 className="day-title">Day {dayPlan.day}</h4>
                <div className="places-grid">
                  {dayPlan.places.map((place, index) => (
                    <div className="place-card" key={index}>
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
                        <p>{place.details}</p>
                        <span className="place-price">{place.ticketPrice}</span>
                      </div>
                    </div>
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

export default ViewTrip;