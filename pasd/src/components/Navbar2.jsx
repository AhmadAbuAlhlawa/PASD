import React, { useEffect, useState } from "react";
import "../css/Navbar2.css";
import { useLocation } from "react-router-dom";

function Navbar2() {
  const location = useLocation();
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  // Fetch newest_logs
  useEffect(() => {
    fetch("http://localhost:5000/newest_logs")
      .then((res) => res.json())
      .then((logs) => {
        setLogs(logs);
        console.log(logs);
      })
      .catch((error) => console.error(error)); // Handle error here
  }, []);

  // Toggle display of logs
  const toggleLogs = () => {
    setShowLogs((prev) => !prev);
  };

  return (
    <nav className="navbar2 navbar navbar-expand-lg sticky-top">
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
                  <a className="dropdown-item" href="/Cities">
                    Cities
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/Buildings">
                    Buildings
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/Architects">
                    Architects
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
          <button className="btn" onClick={toggleLogs}>
            News
          </button>
          {showLogs && (
            <div className="logs-container">
              <h5 className="mb-4">Latest News</h5>
              <ul>
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <li key={index}>
                      <span>Action:</span> {log.action}
                      <br />
                      <span>Details:</span> {log.details}
                      <br />
                      <span>Date:</span> {new Date(log.timestamp).toLocaleString()}
                    </li>
                  ))
                ) : (
                  <h2 className="my-5">No logs available.</h2>
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