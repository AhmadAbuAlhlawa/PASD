import React from 'react';
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbarr">
      <div className="navbar-logo">
        <span><strong>PASD {" "}</strong>  <span className='long_text'> - The Palestinian Archive Society for Documentation</span></span>
      </div>
      <a className='btn button_login' href='/'>Login</a>
    </nav>
  );
};

export default Navbar;