import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      {}
      <section className="hero">
        <div className="hero-overlay">
          <h1 className="hero-title">Plan your next trip with AI</h1>
          <p className="hero-subtitle">
            Tell us where you want to go, and let AI build your perfect itinerary in seconds.
          </p>
          <Link to="/create-trip" className="hero-button">Plan My Trip →</Link>
        </div>
      </section>

      {}
      <section id="features" className="features">
        <div className="feature-card">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=180&fit=crop"
            alt="AI itinerary planning"
            className="feature-image"
          />
          <h3>AI-Generated Itinerary</h3>
          <p>Get a custom day-by-day travel plan built by AI, tailored to your budget and travel style.</p>
        </div>
        <div className="feature-card">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=180&fit=crop"
            alt="Hotel suggestions"
            className="feature-image"
          />
          <h3>Hotel Suggestions</h3>
          <p>Discover hotels that match your budget, from budget stays to luxury resorts.</p>
        </div>
        <div className="feature-card">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=180&fit=crop"
            alt="Places and activities"
            className="feature-image"
          />
          <h3>Places & Activities</h3>
          <p>Explore recommended places to visit, with timing and estimated costs included.</p>
        </div>
        <div className="feature-card">
          <img
            src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=300&h=180&fit=crop"
            alt="Save and revisit trips"
            className="feature-image"
          />
          <h3>Save & Revisit</h3>
          <p>Save your generated trips and come back anytime to view your travel history.</p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="how-it-works">
        <div className="how-it-works-header">
          <span className="section-label"><h1>HOW IT WORKS</h1></span>
          <br></br>

          <h2>Plan. Discover. Explore. Travel.</h2>

          <p>
            TripAI makes planning your next adventure simple, personalized,
            and effortless.
          </p>
          <br></br>
        </div>

        <div className="steps">

          {/* Step 1 */}
          <div className="step">
            <div className="step-number">01</div>
            <h3>Tell Us Your Plans</h3>

            <p>
              Enter your destination, number of days, budget, and who you're
              travelling with.
            </p>
          </div>


          {/* Step 2 */}
          <div className="step">
            <div className="step-number">02</div>
            <h3>Let AI Plan Your Trip</h3>

            <p>
              Our AI creates a personalized day-by-day itinerary based on
              your preferences.
            </p>
          </div>


          {/* Step 3 */}
          <div className="step">
            <div className="step-number">03</div>

            <h3>Discover Hotels & Places</h3>

            <p>
              Explore recommended hotels, attractions, photos, timings,
              prices, and activities.
            </p>
          </div>


          {/* Step 4 */}
          <div className="step">
            <div className="step-number">04</div>

            <h3>Explore From Your Location</h3>

            <p>
              Check distances from your current location and open places
              directly in Google Maps.
            </p>
          </div>


          {/* Step 5 */}
          <div className="step">
            <div className="step-number">05</div>

            <h3>Save & Start Exploring</h3>

            <p>
              Save your personalized trip and access it anytime from your
              saved trips.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;