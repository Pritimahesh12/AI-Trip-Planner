import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (!user) {
    return (
      <>
        <Navbar />

        <div className="profile-page">
          <div className="profile-login-message">
            <h2>Please login first</h2>

            <p>
              You need to login to view your profile.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="profile-button"
            >
              Login
            </button>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <Navbar />

      <main className="profile-page">

        <div className="profile-card">

          {/* Profile Header */}
          <div className="profile-header">

            <div className="profile-avatar">
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>
              <h1>
                {user.name || "Traveler"}
              </h1>

              <p>
                Welcome to your TripAI profile
              </p>
            </div>

          </div>


          {/* User Information */}
          <div className="profile-section">

            <h2>Personal Information</h2>

            <div className="profile-info">

              <div className="info-item">
                <span className="info-label">
                  Full Name
                </span>

                <span className="info-value">
                  {user.name || "Not available"}
                </span>
              </div>


              <div className="info-item">
                <span className="info-label">
                  Email Address
                </span>

                <span className="info-value">
                  {user.email || "Not available"}
                </span>
              </div>

            </div>

          </div>


          {/* Trip Section */}
          <div className="profile-section">

            <h2>My Travel</h2>

            <div className="profile-actions">

              <button
                className="profile-action-button"
                onClick={() => navigate("/my-trips")}
              >
                Saved Trips
              </button>

              <button
                className="profile-action-button"
                onClick={() => navigate("/create-trip")}
              >
                 Plan a New Trip
              </button>

            </div>

          </div>


          {/* Logout */}
          <div className="profile-logout">

            <button
              onClick={handleLogout}
              className="logout-profile-button"
            >
              Logout
            </button>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}

export default Profile;