import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { eventAPI } from "../services/api";
import { useClub } from "../contexts/ClubContext";
import Navbar from "../components/Navbar";
import "./EventManagement.css";

function EventManagement() {
  const { selectedClub } = useClub();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const navigate = useNavigate();

  const toggleExpand = (eventUid) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventUid)) {
        newSet.delete(eventUid);
      } else {
        newSet.add(eventUid);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (selectedClub) {
      fetchEvents();
    }
  }, [selectedClub]);

  const fetchEvents = async () => {
    if (!selectedClub) return;

    setError("");
    setLoading(true);

    try {
      const response = await eventAPI.getClubEvents(selectedClub.uid);
      setEvents(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventUid, eventName) => {
    if (!window.confirm(`Are you sure you want to delete "${eventName}"?`)) {
      return;
    }

    try {
      await eventAPI.delete(eventUid);
      setEvents(events.filter((e) => e.uid !== eventUid));
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete event");
    }
  };

  const handleEdit = (eventUid) => {
    navigate(`/events/${eventUid}/edit`);
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (!selectedClub) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="content-wrapper">
          <div className="no-club-banner">
            <div className="banner-icon">⚠️</div>
            <div className="banner-content">
              <h3>No Club Selected</h3>
              <p>
                Please select a club from the navigation bar to manage its
                events.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="content-wrapper">
        <div className="page-header">
          <div>
            <h1>Event Management</h1>
            <p className="page-subtitle">
              Managing events for {selectedClub.name}
            </p>
          </div>
          <Link to="/events/create" className="btn-primary">
            + Create New Event
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="no-events-banner">
            <div className="banner-icon">📅</div>
            <div className="banner-content">
              <h3>No Events Yet</h3>
              <p>
                Create your first event for {selectedClub.name} to get started.
              </p>
              <Link to="/events/create" className="btn-primary-banner">
                Create Event
              </Link>
            </div>
          </div>
        ) : (
          <div className="events-list">
            {events.map((event) => {
              const isExpanded = expandedEvents.has(event.uid);
              return (
                <div key={event.uid} className="event-card">
                  <div className="event-card-header">
                    <div className="header-left">
                      <button
                        className="accordion-toggle"
                        onClick={() => toggleExpand(event.uid)}
                        title={
                          isExpanded ? "Collapse details" : "Expand details"
                        }
                      >
                        <span
                          className={`accordion-icon ${
                            isExpanded ? "expanded" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                      <div>
                        <h3>{event.name}</h3>
                        <span className={`status-badge status-${event.status}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                    <div className="event-actions">
                      <button
                        onClick={() => handleEdit(event.uid)}
                        className="btn-edit"
                        title="Edit event"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.uid, event.name)}
                        className="btn-delete"
                        title="Delete event"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  <div className="event-card-summary">
                    <span className="summary-item">
                      📅 {formatDateTime(event.start_datetime)}
                    </span>
                    <span className="summary-item">
                      📍 {event.location || "TBD"}
                    </span>
                    <span className="summary-item">
                      👥 {event.participant_count} participants
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="event-card-body">
                      <div className="event-info-row">
                        <div className="event-info-item">
                          <span className="info-label">📅 Start:</span>
                          <span className="info-value">
                            {formatDateTime(event.start_datetime)}
                          </span>
                        </div>
                        <div className="event-info-item">
                          <span className="info-label">🕐 End:</span>
                          <span className="info-value">
                            {formatDateTime(event.end_datetime)}
                          </span>
                        </div>
                      </div>

                      <div className="event-info-row">
                        <div className="event-info-item">
                          <span className="info-label">📍 Location:</span>
                          <span className="info-value">
                            {event.location || "Not specified"}
                          </span>
                        </div>
                        <div className="event-info-item">
                          <span className="info-label">👥 Type:</span>
                          <span className="info-value">{event.type}</span>
                        </div>
                      </div>

                      <div className="event-info-row">
                        <div className="event-info-item">
                          <span className="info-label">🎯 Limit:</span>
                          <span className="info-value">
                            {event.limit || "No limit"}
                          </span>
                        </div>
                        <div className="event-info-item">
                          <span className="info-label">✅ Participants:</span>
                          <span className="info-value">
                            {event.participant_count}
                          </span>
                        </div>
                      </div>

                      {event.description && (
                        <div className="event-description">
                          <span className="info-label">📝 Description:</span>
                          <p>{event.description}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventManagement;
