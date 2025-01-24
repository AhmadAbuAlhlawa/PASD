import React from 'react';
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbarr">
      <div className="navbar-logo">
         <span><strong>PASD {" "}</strong>  <span className='long_text'> - The Palestinian Archive Society for Documentation</span></span>
      </div>
    </nav>
  );
};

export default Navbar;