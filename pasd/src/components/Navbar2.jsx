import React from "react";
import "../css/Navbar2.css";
import { useLocation } from "react-router-dom";

function Navbar2() {
  const location = useLocation();

  return (
    <nav className="navbar2 navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="/">Home</a>
            </li>
            {location.pathname === "/" && (
              <li className="nav-item">
                <a className="nav-link" href="/#about_pasd">About PASD</a>
              </li>
            )}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Archive</a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="/Cities">Cities</a></li>
                <li><a className="dropdown-item" href="/Buildings">Buildings</a></li>
                <li><a className="dropdown-item" href="/Architects">Architects</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/support-us">Support Us</a>
            </li>
          </ul>
        </div>
        <button className="btn">News</button>
      </div>
    </nav>
  );
}

export default Navbar2;
