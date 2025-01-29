import React from 'react';
import './css/App.css'
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
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

function App() {
  return (
    <>
      <Router>
        <div className="app-container">
          <div className="content">
            <Navbar />
            <Navbar2 />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/Buildings" exact element={<Buildings />} />
              <Route path="/support-us" exact element={<Support />} />
              <Route path="/Architects" exact element={<Architects />} />
              <Route path="/about-us" element={ <AboutUs />} />
              <Route path="/Buildings/:id" element={<BuildingDetails />} />
              <Route path="/Architects/:id" element={<ArchitectDetails />} />
              <Route path="/Cities" element={<Cities />} />
            </Routes>
          </div>
          
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
