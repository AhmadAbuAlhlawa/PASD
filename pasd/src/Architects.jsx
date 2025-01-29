import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BuildingCard from "./BuildingCard";
import { TextField, Box, Button } from "@mui/material";
import Pagination from '@mui/material/Pagination';
import "./css/Architects.css";

const Architects = () => {
    const location = useLocation();
    
    const initialPage = new URLSearchParams(location.search).get('page');
    const [page, setPage] = useState(initialPage ? parseInt(initialPage) : 1);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(''); // Debounced search value
    const [filterMenuVisible, setFilterMenuVisible] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [pagesCount, setPagesCount] = useState(0);
    const [foundArchitects, setFoundArchitects] = useState([]); 
    const [filteredArchitects, setFilteredArchitects] = useState([]); 
    const [sorted, setSorted] = useState(false);

    // Debouncing logic for the search input
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(search); // Update debounced search after delay
      }, 300); // Delay of 300ms
  
      return () => clearTimeout(timer); // Clear timeout on cleanup
    }, [search]);

  // const get 
  useEffect(() => {
    const controller = new AbortController(); // Create AbortController for request cancellation
    const signal = controller.signal;
  
    setLoading(true);
  
    fetch(`http://localhost:5000/Architects_frontend?page=${page}&title=${debouncedSearch}&sorted=${sorted}`, { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Request failed");
        }
        return res.json();
      })
      .then((json) => {
        console.log(json);
        
        setPagesCount(json.Counts_of_Pages || 1); // Fallback to 1 page if no data
        setFoundArchitects(json.Architects || []); // Handle empty response
        setFilteredArchitects(json.Architects || []); // Handle empty response
        setLoading(false);
        setSorted(false); // Reset sorting state when changing page
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.error("Failed to fetch Architects:", err);
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
        let sortedArchitects = [...filteredArchitects];

        if (option === "alphabetical") {
            sortedArchitects.sort((a, b) => a.architect_name.localeCompare(b.architect_name));
        }

        setFilteredArchitects(sortedArchitects);
        setFilterMenuVisible(false);
    };
        
  return (
    <div className="Architects">
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
      {loading? (
        <h2>Loading...</h2>
      ) : (
        <>
          <div className="building-grid">
            {filteredArchitects.length > 0 ? 
              filteredArchitects.map((architect) => (
                <div className="arch_card">
                <div className="arch_card-image-container">
                  {architect.filename ?
                    <img src={`${architect.filename}`} alt={`${architect.architect_name} image`} className="arch_card-image" />
                    :
                    <img src={'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'} alt={`${architect.architect_name} image`} className="card-image" />
                  }
                </div>
                <div className="arch_card-content">
                  <h3>{architect.architect_name}</h3>
                  <p>{architect.en_biography}</p>
                  <a href={`/Architects/${architect._id}`} className="arch_card-button">
                    {("Learn More")}
                  </a>
                </div>
              </div>
              ))
            :
            <h2>No Architects found</h2>
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
        )    
    }
    </div>
  )
}

export default Architects