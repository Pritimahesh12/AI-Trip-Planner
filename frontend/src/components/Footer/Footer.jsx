import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>TripAI</h3>
          <p>Plan smarter trips with the power of AI.</p>
        </div>

        <div className="footer-links">
          <h4>Links</h4>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <a href="#about">About us</a>
          <a href="#contact">Contact us</a>
          <a href="#help">Help desk</a>
        </div>
      </div>

      <div className="footer-bottom">
        <b>&hearts; love nature</b>
      </div>
    </footer>
  );
}

export default Footer;