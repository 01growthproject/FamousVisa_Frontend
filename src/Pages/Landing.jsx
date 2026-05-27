import React from "react";
import { Link } from "react-router-dom";
import "../Pages/Styles/Landing.css";

const Landing = () => {
  return (
    <div className="landing-wrapper">
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/logoo.png" alt="Logo" className="nav-logo-img" />
          </div>

          <Link to="/login" className="nav-login-btn">
            Login
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>

              <span className="badge-text">
                Professional Visa Client Management System
              </span>
            </div>

            <h1 className="hero-title">
              Start Your
              <span className="hero-title-gradient">
                {" "}
                Global Visa Journey
              </span>
            </h1>

            <p className="hero-subtitle">
              Simplify visa applications, client management, and document
              tracking with our secure and modern platform built for visa
              consultants and immigration agencies.
            </p>

            <div className="hero-cta">
              <Link to="/login" className="cta-primary">
                <span className="cta-icon"></span>

                <span className="cta-text">
                  <span className="cta-title">Get Started</span>

                  <span className="cta-subtitle">
                    Access Dashboard
                  </span>
                </span>

                <span className="cta-arrow">→</span>
              </Link>

              <div className="hero-stats-container">
                <div className="stat-item">
                  <div className="stat-icon-wrapper">
                    <span className="stat-icon">⚡</span>
                  </div>

                  <div className="stat-content">
                    <span className="stat-number">Fast Process</span>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon-wrapper">
                    <span className="stat-icon">🔒</span>
                  </div>

                  <div className="stat-content">
                    <span className="stat-number">Secure Data</span>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon-wrapper">
                    <span className="stat-icon">🌍</span>
                  </div>

                  <div className="stat-content">
                    <span className="stat-number">Worldwide Services</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card main-card">
              {/* <div className="card-header">
                <div className="card-icon">✈️</div>

                <div className="card-badge">Live</div>
              </div> */}

              <div className="visual-content">
                <h3>Visa Client Management System</h3>

                <p>
                  Manage visa applications, track client documents,
                  monitor case progress, and streamline daily
                  operations efficiently.
                </p>

                <div className="card-features">
                  <div className="feature-item">
                    <span className="feature-check">✓</span>

                    <span>Application Tracking</span>
                  </div>

                  <div className="feature-item">
                    <span className="feature-check">✓</span>

                    <span>Secure Documents</span>
                  </div>

                  <div className="feature-item">
                    <span className="feature-check">✓</span>

                    <span>Easy Client Access</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-card card-1">
              <div className="mini-icon">📄</div>

              <div className="mini-text">
                <span className="mini-title">Visa Files</span>

                <span className="mini-subtitle">
                  Manage Applications
                </span>
              </div>
            </div>

            <div className="floating-card card-2">
              <div className="mini-icon">🛂</div>

              <div className="mini-text">
                <span className="mini-title">Immigration</span>

                <span className="mini-subtitle">
                  Quick Processing
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-text">
                  <h3>Famous Visa Consultant</h3>

                  <span>Visa & Immigration Services</span>
                </div>
              </div>

              <p className="footer-tagline">
                Trusted guidance • Global opportunities • Your visa partner
              </p>

              <p className="footer-copyright">
                © 2018 Famous Visa Consultant. All rights reserved.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Quick Links</h4>

                <Link to="/login">Admin Login</Link>
              </div>

              <div className="footer-column">
                <h4>Contact</h4>

                <p>
                  📍 Second Floor, Famous Visa Consultant,
                  SCO 1-2, Opposite Berkley Hyundai,
                  Swastik Vihar, Utrathiya,
                  Zirakpur, Punjab 140603
                </p>

                <p>✉️ info@famousvisaconsultant.com</p>

                <p>📞 +91 98769 79635</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;