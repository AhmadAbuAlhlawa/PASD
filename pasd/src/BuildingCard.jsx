
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/BuildingCard.css";


function BuildingCard({ building }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-image-container">
        {building.image?.filename ?
          <img src={`${building.image?.filename}`} alt={`${building.building_name} image`} className="card-image" />
          :
          <img src={'https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'} alt={`${building.building_name} image`} className="card-image" />
        }
      </div>
      <div className="card-content">
        <h3>{building.building_name}</h3>
        <p>{building.en_description}</p>
        <a href={`/Buildings/${building._id}`} className="card-button">
          {("Learn More")}
        </a>
      </div>
    </div>
  );
}

export default BuildingCard;
