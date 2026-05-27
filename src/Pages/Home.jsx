import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import "./Styles/home.css";

const HomeContent = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            {/* <div className="hero-badge">
              <span className="badge-icon"></span>
              <span className="badge-text"></span>
            </div> */}
            <h1>Manage Your Visa Cases Efficiently</h1>
            <p>Track visa applications, monitor client documents, and streamline your immigration agency operations with our secure platform</p>
            <div className="hero-buttons">
              <Link to="/form" className="btn btn-primary">
                <span className="btn-icon">➕</span>
                Register New Client
              </Link>
              <Link to="/admin" className="btn btn-secondary">
                <span className="btn-icon">👥</span>
                View All Cases
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">⚡</span>
            </div>
            <div className="stat-content">
              <span className="stat-number">Fast Process</span>
              <span className="stat-desc">Quick application tracking</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">🔒</span>
            </div>
            <div className="stat-content">
              <span className="stat-number">Secure Data</span>
              <span className="stat-desc">Enterprise-grade security</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <span className="stat-icon">🌍</span>
            </div>
            <div className="stat-content">
              <span className="stat-number">Worldwide Services</span>
              <span className="stat-desc">Global visa coverage</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🛂</span>
              <h3>Document Management</h3>
              <p>Securely store and organize client documents with easy access and version control</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">👤</span>
              <h3>Client Portal</h3>
              <p>Give your clients easy access to their visa case status and required documents</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3>Analytics & Reports</h3>
              <p>Get comprehensive insights into your visa processing metrics and case statistics</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Wrap with ProtectedRoute
const Home = () => {
  return <ProtectedRoute>{<HomeContent />}</ProtectedRoute>;
};

export default Home;