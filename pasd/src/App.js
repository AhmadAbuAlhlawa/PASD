import React from 'react';
import './css/App.css'
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import Navbar from './components/Navbar';
import Navbar2 from './components/Navbar2';
import Buildings from './Buildings';
import BuildingDetails from './BuildingDetails';
import Main from "./Main";

function App() {
  return (
    <>
    <Router>
        <Navbar />
        <Navbar2 />
        <Routes>
          <Route path='/' element={<Main/>}/>
          <Route path='/Buildings' exact element={<Buildings/>}/>
          <Route path='/Buildings/:id' element={<BuildingDetails/>} />
          <Route path='/Cities' element={"cities element"}/>
        </Routes>
        <div className="h">
          <a href='a'>Contact us   | </a>
          <a href='a'>Privacy Policy</a>
        </div>
    </Router>
    </>
  );
}

export default App;
