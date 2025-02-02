import React from 'react';
import './css/App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Navbar2 from './components/Navbar2';
import Buildings from './Buildings';
import BuildingDetails from './BuildingDetails';
import AboutUs from './AboutUs';
import Main from "./Main";
import Footer from './components/Footer';
import Cities from './Cities';
import Architects from './Architects';
import ArchitectDetails from './ArchitectDetails';
import Support from './Support';
import Map_page from './Map_page';

function Layout() {
  const location = useLocation();
  
  // Check if the current route is the Map_page
  const isMapPage = location.pathname.startsWith("/map");

  return (
    <div className="app-container">
      {!isMapPage && <Navbar />}
      <Navbar2 />

      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Buildings" exact element={<Buildings />} />
          <Route path="/support-us" exact element={<Support />} />
          <Route path="/Architects" exact element={<Architects />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/Buildings/:id" element={<BuildingDetails />} />
          <Route path="/Architects/:id" element={<ArchitectDetails />} />
          <Route path="/Cities" element={<Cities />} />
          <Route path="/map/:city_id" element={<Map_page />} />
        </Routes>
      </div>

      {!isMapPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
