import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BuildingCard from "./BuildingCard";
import Pagination from '@mui/material/Pagination';
import Select from "react-select"; // Import react-select
import "./css/Buildings.css";

function Buildings() {
  const location = useLocation();
  
  const initialPage = new URLSearchParams(location.search).get('page');
  const [page, setPage] = useState(initialPage ? parseInt(initialPage) : 1);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [pagesCount, setPagesCount] = useState(0);
  const [foundBuildings, setFoundBuildings] = useState([]); 
  const [filteredBuildings, setFilteredBuildings] = useState([]); 

  const [cities, setCities] = useState([]); // Store fetched cities
  const [selectedCity, setSelectedCity] = useState({ value: "all", label: "All Cities" });

  // Fetch cities on mount
  useEffect(() => {
    fetch("http://localhost:5000/get-cities") // Adjust API endpoint if needed
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        
        setCities(data || []);
      })
      .catch((err) => console.error("Failed to fetch cities:", err));
  }, []);

  // Debouncing search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
  
    setLoading(true);
  
    fetch(`http://localhost:5000/buildings_frontend?page=${page}&title=${debouncedSearch}&city=${selectedCity.value}`, { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Request failed");
        }
        return res.json();
      })
      .then((json) => {
        setPagesCount(json.Counts_of_Pages || 1);
        setFoundBuildings(json.buildings || []);
        setFilteredBuildings(json.buildings || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.error("Failed to fetch buildings:", err);
        }
        setLoading(false);
      });
  
    return () => controller.abort();
  }, [page, selectedCity.value, debouncedSearch]);

  // Handle page change
  const handlePageChange = (e, value) => {
    if (page === value) return;
    setPage(value);
  };

  const handleSearchInput = (e) => {
    const text = e.target.value.trimStart();
    setPage(1);
    setSearch(text);
  };

  // Handle city selection
  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption || null);
  };

  return (
    <div className="Buildings">
      <h2>Buildings</h2>
      <div className="d-flex filter_search">
        {/* Search Input */}
        <div className="search-container">
          <input 
            type="text"
            value={search}
            onChange={handleSearchInput}
            placeholder="Search here..."
            className="search-input"
          />
        </div>

        {/* Cities Multi-Select Filter */}
        <div className="cities-filter">
          <Select
            options={[
              { value: "all", label: "All Cities" }, // First option
              ...cities.map(city => ({
                value: city._id,
                label: city.city_name
              }))
            ]}
            value={selectedCity}
            onChange={handleCityChange}
            placeholder="Select Cities..."
            className="city-select"
          />
        </div>
      </div>

      {loading ? (
        <h2 className='mt-3'>Loading...</h2>
      ) : (
        <>
          <div className="building-grid">
            {filteredBuildings.length > 0 ? 
              filteredBuildings.map((building) => (
                <BuildingCard key={building._id} building={building} />
              ))
            :
            <h2>No buildings found</h2>
            }
          </div>

          {pagesCount > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <Pagination
              count={pagesCount}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              color="standard"
              className="whiteTextPagination"
            />
          </div>
          )}
        </>
      )}
    </div>
  );
}

export default Buildings;
