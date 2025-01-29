import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BuildingCard from "./BuildingCard";
import { TextField, Box, Button } from "@mui/material";
import Pagination from '@mui/material/Pagination';
import "./css/Buildings.css";

function Buildings() {
  const location = useLocation();
  
  const initialPage = new URLSearchParams(location.search).get('page');
  const [page, setPage] = useState(initialPage ? parseInt(initialPage) : 1);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); // Debounced search value
  const [filterMenuVisible, setFilterMenuVisible] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [pagesCount, setPagesCount] = useState(0);
  const [foundBuildings, setFoundBuildings] = useState([]); 
  const [filteredBuildings, setFilteredBuildings] = useState([]); 
  const [sorted, setSorted] = useState(false);

  // Debouncing logic for the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search); // Update debounced search after delay
    }, 300); // Delay of 300ms

    return () => clearTimeout(timer); // Clear timeout on cleanup
  }, [search, sorted]);

  const getBuildings = () => {
  
  }
  useEffect(() => {
    const controller = new AbortController(); // Create AbortController for request cancellation
    const signal = controller.signal;
  
    setLoading(true);
  
    fetch(`http://localhost:5000/buildings_frontend?page=${page}&title=${debouncedSearch}&sorted=${sorted}`, { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Request failed");
        }
        return res.json();
      })
      .then((json) => {
        console.log(json);
        
        setPagesCount(json.Counts_of_Pages || 1); // Fallback to 1 page if no data
        setFoundBuildings(json.buildings || []); // Handle empty response
        setFilteredBuildings(json.buildings || []); // Handle empty response
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
  
    return () => controller.abort(); // Abort previous request when effect is re-run
  }, [page, sorted, debouncedSearch]);

  // Handle page change
  const handlePageChange = (e, value) => {
    if (page === value) return;
    setPage(value);
  };

  const handleSearchInput = (e) => {
    const text = e.target.value.trimStart();
    setPage(1); // Reset page number to 1 on new search
    setSearch(text);
  };
  
  const toggleFilterMenu = () => {
    setFilterMenuVisible((prev) => !prev);
  };

  const applyFilter = (option) => {
    let sortedBuildings = [...filteredBuildings];

    if (option === "alphabetical") {
      setSorted(true);
    }

    setFilteredBuildings(sortedBuildings);
    setFilterMenuVisible(false);
  };

  return (
    <div className="Buildings">
      <div className="search-container">
        <input type="text"
          value={search}
          onChange={handleSearchInput}
          placeholder="Search here..."
          className="search-input"
        />
        <Button className="search-button" onClick={toggleFilterMenu}>Filter</Button>
      </div>
      {filterMenuVisible && (
        <div className="filter-menu show">
          <Button onClick={() => applyFilter("alphabetical")}>ترتيب أبجدي</Button>
        </div>
      )}

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <div className="building-grid">
            {filteredBuildings.length > 0 ? 
              filteredBuildings.map((building) => (
                <BuildingCard building={building} />
              ))
            :
            <h2>No buildings found</h2>
            }
          </div>
          {pagesCount > 1 && /* Render Pagination only if pages count > 1 */
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
          }
        </>
      )}
    </div>
  );
}

export default Buildings;