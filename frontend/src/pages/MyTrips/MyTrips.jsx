import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./MyTrips.css";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axiosInstance.get("/trips");
        setTrips(res.data);
      } catch (err) {
        setError("Failed to load your trips. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleDelete = async (e, tripId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      await axiosInstance.delete(`/trips/${tripId}`);
      setTrips(trips.filter((t) => t._id !== tripId));
    } catch (err) {
      alert("Failed to delete trip. Please try again.");
    }
  };

  return (
    <div className="mytrips-page">
      <Navbar />

      <div className="mytrips-container">
        <h1>Your Saved Trips</h1>
        <p className="mytrips-subtitle">All your AI-generated itineraries in one place</p>

        {loading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Loading your trips...</p>
          </div>
        )}

        {error && <div className="mytrips-error">{error}</div>}

        {!loading && !error && trips.length === 0 && (
          <div className="empty-state">
            <p>You haven't planned any trips yet.</p>
            <Link to="/create-trip" className="empty-cta">Plan your first trip →</Link>
          </div>
        )}

        {!loading && trips.length > 0 && (
          <div className="trips-grid">
            {trips.map((trip) => (
              <Link to={`/trips/${trip._id}`} className="trip-card" key={trip._id}>
                <div className="trip-card-header">
                  <h3>{trip.destination}</h3>
                  <span className="trip-days">{trip.days} Days</span>
                </div>
                <div className="trip-card-tags">
                  <span className="tag">{trip.budget}</span>
                  <span className="tag">{trip.travelers}</span>
                </div>
                <p className="trip-date">
                  Saved on {new Date(trip.createdAt).toLocaleDateString()}
                </p>
                <button className="delete-btn" onClick={(e) => handleDelete(e, trip._id)}>Delete</button>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MyTrips;