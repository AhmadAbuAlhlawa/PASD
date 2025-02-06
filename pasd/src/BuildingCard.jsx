import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/BuildingCard.css";

function BuildingCard({ building }) {
  const navigate = useNavigate();

  return (
    <a href={`Buildings/${building._id}`} className="card">
      <div className="card-image-container">
        {building.image?.filename ? (
          <a href={`/Buildings/${building._id}`}>
            <img
              src={`${building.image?.filename}`}
              alt={`${building.building_name} image`}
              className="card-image"
            />
          </a>
        ) : (
          <a href={`/Buildings/${building._id}`}>
            <img
              src={
                "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg"
              }
              alt={`${building.building_name} image`}
              className="card-image"
            />
          </a>
        )}
      </div>
      <div className="card-content">
        <h3>{building.building_name}</h3>
        <p>{building.en_description}</p>
        <a href={`/Buildings/${building._id}`} className="card-button">
          {"Learn More"}
        </a>
      </div>
    </a>
  );
}

export default BuildingCard;
