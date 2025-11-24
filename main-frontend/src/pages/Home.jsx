import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { clubAPI, eventAPI } from "../services/api";
import Navbar from "../components/Navbar";
import "./Home.css";

function Home() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clubsResponse, eventsResponse] = await Promise.all([
        clubAPI.getAll(),
        eventAPI.getAll(),
      ]);
      setClubs(clubsResponse.data || []);
      setEvents(eventsResponse.data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "TBD";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="home-container">
        <div className="home-header">
          <h1>Explore Campus Life</h1>
          <p>Discover clubs and events happening around campus</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            📅 Events
          </button>
          <button
            className={`tab ${activeTab === "clubs" ? "active" : ""}`}
            onClick={() => setActiveTab("clubs")}
          >
            🎯 Clubs
          </button>
        </div>

        {activeTab === "events" && (
          <div className="content-section">
            <h2>Upcoming Events</h2>
            {events.length === 0 ? (
              <div className="empty-state">
                <p>No events available at the moment.</p>
              </div>
            ) : (
              <div className="cards-grid">
                {events.map((event) => (
                  <Link
                    key={event.uid}
                    to={`/event/${event.uid}`}
                    className="card"
                  >
                    <div className="card-header">
                      <h3>{event.name}</h3>
                      <span className={`status-badge status-${event.status}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="card-body">
                      <p className="card-info">
                        <span className="info-icon">📅</span>
                        {formatDateTime(event.start_datetime)}
                      </p>
                      <p className="card-info">
                        <span className="info-icon">📍</span>
                        {event.location || "Location TBD"}
                      </p>
                      <p className="card-info">
                        <span className="info-icon">👥</span>
                        {event.type}
                      </p>
                      {event.description && (
                        <p className="card-description">{event.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "clubs" && (
          <div className="content-section">
            <h2>Student Organizations</h2>
            {clubs.length === 0 ? (
              <div className="empty-state">
                <p>No clubs available at the moment.</p>
              </div>
            ) : (
              <div className="cards-grid">
                {clubs.map((club) => (
                  <Link
                    key={club.uid}
                    to={`/club/${club.uid}`}
                    className="card"
                  >
                    <div className="card-header">
                      <h3>{club.name}</h3>
                      <span className="club-status">
                        {club.status || "Active"}
                      </span>
                    </div>
                    <div className="card-body">
                      {club.description && (
                        <p className="card-description">{club.description}</p>
                      )}
                      <p className="card-info">
                        <span className="info-icon">💰</span>
                        Budget: ${club.budget || 0}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
