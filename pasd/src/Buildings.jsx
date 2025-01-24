// Buildings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuildingCard from "./BuildingCard";
import { TextField, Box, Button } from "@mui/material";
import "./css/Buildings.css";

function Buildings() {
  const navigate = useNavigate();
  const [filteredBuildings, setFilteredBuildings] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filterMenuVisible, setFilterMenuVisible] = useState(false); 
  const [foundBuildings, setFoundBuildings] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/buildings/`)
      .then((res) => res.json())
      .then((json) => {
        setFoundBuildings(json);
        console.log(json)
        setLoading(false);
        setFilteredBuildings(json); 
      })
      .catch((err) => {
        setLoading(false);
        console.error("Failed to fetch buildings:", err)
      });
      
  }, []);

  
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredBuildings(foundBuildings); 
    } else {
      const filtered = foundBuildings.filter((building) =>
        building.building_name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredBuildings(filtered);
    }
  };

  
  const toggleFilterMenu = () => {
    setFilterMenuVisible((prev) => !prev);
  };

  const applyFilter = (option) => {
    let sortedBuildings = [...filteredBuildings];

    if (option === "alphabetical") {
      sortedBuildings.sort((a, b) => a.building_name.localeCompare(b.building_name));
    }

    setFilteredBuildings(sortedBuildings);
    setFilterMenuVisible(false);
  };

  return (
    <div className="Buildings">
      <Box sx={{ padding: "20px", textAlign: "center" }}>
        <TextField
          variant="outlined"
          size="small"
          label="search buildings"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          sx={{
            backgroundColor: "white",
            borderRadius: "4px",
            maxWidth: "600px",
          }}
        />
        <Button className="filter-btn" onClick={toggleFilterMenu}>
          filter
        </Button>
      </Box>


      {filterMenuVisible && (
        <div className="filter-menu show">
          <Button onClick={() => applyFilter("alphabetical")}>ترتيب أبجدي</Button>
        </div>
      )}


      {loading ?
        <h2>Loading...</h2>
      :
      <div className="building-grid">
        {filteredBuildings.map((building) => (
          <div key={building._id}>
            <BuildingCard building={building} />
          </div>
        ))}
      </div>
      }
    </div>
  );
}

export default Buildings;
