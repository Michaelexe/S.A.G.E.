import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      <div className="landing-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Welcome to <span className="accent-text">Campus Clubs</span>
          </h1>
          <p className="hero-subtitle">
            Discover, Join, and Engage with Student Organizations
          </p>
          <p className="hero-description">
            Connect with like-minded students, participate in exciting events,
            and make the most of your college experience.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary-large">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary-large">
              Sign In
            </Link>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Discover Clubs</h3>
            <p>
              Explore a wide variety of student organizations tailored to your
              interests and passions.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Join Events</h3>
            <p>
              Stay updated with upcoming events and participate in activities
              that matter to you.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Engage & Discuss</h3>
            <p>
              Connect with fellow students through event discussions and build
              lasting friendships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
