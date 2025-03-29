import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="logo-link">
              <img 
                src="bhojan-logo.png" 
                alt="Bhojan Logo" 
                className="footer-logo" 
                loading="lazy"
              />
            </Link>
            <p className="footer-description">
              At Bhojan, we believe in serving delicious and nutritious meals that
              cater to every taste. Our diverse menu features fresh salads, hearty
              rolls, tempting desserts, and more, all crafted with quality
              ingredients.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <img src={assets.facebook_icon} alt="Facebook" width="24" height="24" />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <img src={assets.twitter_icon} alt="Twitter" width="24" height="24" />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <img src={assets.linkedin_icon} alt="LinkedIn" width="24" height="24" />
              </a>

            </div>
          </div>

          <div className="footer-sections">
            <div className="footer-links">
              <h3 className="footer-heading">Company</h3>
              <ul className="footer-nav">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                <li><Link to="/menu" className="footer-link">Our Menu</Link></li>
                <li><Link to="/delivery" className="footer-link">Delivery</Link></li>
                <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              </ul>
            </div>

            <div className="footer-contact">
              <h3 className="footer-heading">Contact Us</h3>
              <ul className="contact-info">
                <li className="contact-item">
      
                  <a href="tel:+9779824066201" className="contact-link">+977 9824066201</a>
                </li>
                <li className="contact-item">

                  <a href="mailto:contact@bhojan.com" className="contact-link">contact@bhojan.com</a>
                </li>
                <li className="contact-item">

                  <span className="contact-text">Kathmandu, Nepal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="copyright">
            Copyright &copy; {currentYear} Bhojan.com - All Rights Reserved
          </p>
          <div className="legal-links">
            <Link to="/terms" className="legal-link">Terms of Service</Link>
            <Link to="/privacy" className="legal-link">Privacy Policy</Link>
            <Link to="/cookies" className="legal-link">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;