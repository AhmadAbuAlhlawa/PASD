import React, { useState } from "react";
import "../css/Searchb.css";  
const Searchb = () => {
  const [query, setQuery] = useState(""); // State to hold the search query
  const [results, setResults] = useState(""); // State to hold search results

  const handleSearch = () => {
    if (query.trim() === "") {
      setResults("Please enter a search term!");
    } else {
      setResults(`You searched for: ${query}`);
    }
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      <div>{results && <p>{results}</p>}</div>
    </div>
  );
};

export default Searchb;
