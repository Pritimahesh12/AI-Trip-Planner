import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <Link to="/" className="navbar-logo">
        TripAI
      </Link>

      {/* Center Links */}
      <div className="navbar-center">

        <a href="#features" className="navbar-link">
          Features
        </a>

        <a href="#how-it-works" className="navbar-link">
          How it works
        </a>

        {isLoggedIn && (
          <Link to="/my-trips" className="navbar-link">
            Saved Trips
          </Link>
        )}

      </div>

      {/* Right Links */}
      <div className="navbar-right">

        {isLoggedIn ? (
          <>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="navbar-link logout-btn"
            >
              Logout
            </button>

            <Link to="/profile" className="navbar-profile" title="Profile">
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </>
        ) : (
          <>
            {/* Login */}
            <Link to="/login" className="navbar-link">
              Login
            </Link>

            {/* Plan Trip */}
            <Link to="/create-trip" className="navbar-btn">
              Plan a Trip
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;