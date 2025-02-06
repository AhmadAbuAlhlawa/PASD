import React, { useEffect, useState } from "react";
import "../css/Navbar2.css";
import { useLocation } from "react-router-dom";

function Navbar2() {
  const location = useLocation();
  const [Events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);

  // Fetch newest_Events
  useEffect(() => {
    fetch("http://localhost:5000/Events")
      .then((res) => res.json())
      .then((Events) => {
        setEvents(Events);
        console.log(Events);
      })
      .catch((error) => console.error(error)); // Handle error here
  }, []);

  // Toggle display of Events
  const toggleEvents = () => {
    setShowEvents((prev) => !prev);
  };

  return (
    <nav className="navbar2 px-2 navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="/">
                Home
              </a>
            </li>
            {location.pathname === "/" && (
              <li className="nav-item">
                <a className="nav-link" href="/#about_pasd">
                  About PASD
                </a>
              </li>
            )}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Archive
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="/Architects">
                    Architects
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/Buildings">
                    Buildings
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/Cities">
                    Cities
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/support-us">
                Support Us
              </a>
            </li>
          </ul>
        </div>
        <div className="news_container">
          <button className="btn" onClick={toggleEvents}>
            News
          </button>
          {showEvents && (
            <div className="Events-container">
              <h5 className="mb-4">Latest Events</h5>
              <ul className="events_row">
                {Events.length > 0 ? (
                  Events.map((event, index) => (
                    <li className="event" key={index}>
                      <p className="event_title">{event.title}</p>
                      <p className="mb-0">{event.content}</p>
                      <p className="date">
                        <span>Date:</span>{" "}
                        {new Date(event.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))
                ) : (
                  <h2 className="my-5">No Events available.</h2>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar2;
