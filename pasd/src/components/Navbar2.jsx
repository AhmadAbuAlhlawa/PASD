import React from "react";
import "../css/Navbar2.css";
import { useLocation } from "react-router-dom";

function Navbar2() {
  const location = useLocation();

  return (
<nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top">
  <div class="container-fluid">

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        {location.pathname === "/" && (
          <li className="nav-item">
            <a className="nav-link" href="/#about_pasd">About PASD</a>
          </li>
        )}
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Archive</a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="/Cities">Cities</a></li>
            <li><a class="dropdown-item" href="/Buildings">Buildings</a></li>
            <li><a class="dropdown-item" href="/Architects">Architects</a></li>
          </ul>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/support-us">Support Us</a>
        </li>
      </ul>
    </div>
    <button class="btn btn-warning">News</button>
  </div>
</nav>
  );
}

export default Navbar2;
