import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/BuildingDetails.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import SwiperBuildings from "./components/SwiperBuildings";
import MapComponent from "./components/MapComponent";

function BuildingDetails() {
  const { id } = useParams();

  const [foundBuilding, setFoundBuilding] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1); // State for zoom level

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/buildings_frontend/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        setFoundBuilding(json);
        console.log(json);
      })
      .catch((error) => {
        console.error("Error fetching building:", error);
        setLoading(false);
      });
  }, [id]);

  if (!foundBuilding) {
    return <h2 className="not-found">المبنى غير موجود</h2>;
  }

  const handleOpen = (image) => {
    setSelectedImage(image);
    setZoomLevel(1); // Reset zoom level when opening a new image
  };

  const handleClose = () => {
    setSelectedImage(null);
    setZoomLevel(1); // Reset zoom level when closing the dialog
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3)); // Max zoom level is 3
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5)); // Min zoom level is 0.5
  };

  return (
    <div className="details-container">
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div className="details-card">
          <h1 className="details-title">{foundBuilding.building_name}</h1>
          <div className="details-content">
            {/* Gallery Section */}
            <div className="hero_section hero_section_1">
              {foundBuilding.images?.length > 0 && (
                <div
                  id="buildingCarousel"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-indicators">
                    {foundBuilding.images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target="#buildingCarousel"
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-current={index === 0 ? "true" : "false"}
                        aria-label={`Slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>

                  <div className="carousel-inner">
                    {foundBuilding.images.map((image, index) => (
                      <div
                        key={index}
                        className={`carousel-item ${
                          index === 0 ? "active" : ""
                        }`}
                      >
                        <img
                          src={image.filename}
                          className="d-block w-100"
                          alt={`${image.type} of ${foundBuilding.building_name}`}
                          onClick={() => handleOpen(image)}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#buildingCarousel"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>

                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#buildingCarousel"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              )}
            </div>
            <div className="desc_map">
              <p className="details-description">
                {foundBuilding.en_description}
              </p>
              <div className="map">
                <MapComponent
                  buildings={[foundBuilding]}
                  page={"buildingDetails"}
                />
              </div>
            </div>
            {/* section_2 */}

            {foundBuilding.thsLink !== "" && (
              <h2 className="details-title">360 view</h2>
            )}
            {foundBuilding.thsLink !== "" && (
              <div className="slider_360">
                <div
                  className="view_360_div"
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  <iframe
                    src={foundBuilding.thsLink}
                    frameBorder="0"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                    title="360 Degree View"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Fullscreen Image Dialog */}
            <Dialog
              open={Boolean(selectedImage)}
              onClose={handleClose}
              maxWidth="lg"
              fullScreen // Makes the dialog full screen
              PaperProps={{
                style: {
                  background: "rgba(0, 0, 0, 0.8)", // Dark overlay effect
                  backdropFilter: "blur(10px)", // Blurs the background
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
            >
              <DialogActions style={{ position: "absolute", top: 10, right: 10 }}>
                {/* Close Button */}
                <IconButton onClick={handleClose} title="Close" style={{ color: "white" }}>
                  <ClearIcon />
                </IconButton>
              </DialogActions>

              <DialogContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Display image */}
                <img
                  src={selectedImage?.filename}
                  alt="Selected"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transition: "transform 0.3s ease",
                    maxWidth: "90%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                />

                {/* Show image description under the image */}
                {selectedImage?.desc && (
                  <p
                    style={{
                      color: "white",
                      fontSize: "1.2rem",
                      marginTop: "20px",
                      padding: "0 20px",
                      maxWidth: "80%",
                      textAlign: "center",
                    }}
                  >
                    {selectedImage.desc}
                  </p>
                )}
              </DialogContent>
            </Dialog>


            <div className="details-table-container">
              <h2>Building Information</h2>
              <div className="details-table-row">
                <table className="details-table">
                  <tbody>
                    <tr>
                      <th>Architect Name</th>
                      <td>
                        {foundBuilding.architects?.map((architect) => (
                          <li key={architect.architect_id?._id}>
                            {architect.architect_id?.architect_name}
                          </li>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <th>Country</th>
                      <td>
                        {
                          foundBuilding.address_id?.city_id?.country_id
                            ?.country_name
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>Location</th>
                      <td>{foundBuilding.address_id?.city_id?.city_name}</td>
                    </tr>
                    <tr>
                      <th>Address</th>
                      <td>{foundBuilding.address_id?.street}</td>
                    </tr>
                    <tr>
                      <th>Date of Construction</th>
                      <td>{foundBuilding.dateOfConstruction}</td>
                    </tr>
                    <tr>
                      <th>Original Use</th>
                      <td>
                        {foundBuilding.usages?.find(
                          (usage) => usage.type === "original"
                        )?.usage_id?.use_type || ""}
                      </td>
                    </tr>
                    <tr>
                      <th>Current Use</th>
                      <td>
                        {foundBuilding.usages?.find(
                          (usage) => usage.type === "current"
                        )?.usage_id?.use_type || ""}
                      </td>
                    </tr>
                    <tr>
                      <th>Area (m²)</th>
                      <td>{foundBuilding.area}</td>
                    </tr>
                  </tbody>
                </table>
                <table className="details-table">
                  <tbody>
                    <tr>
                      <th>Status</th>
                      <td>
                        {foundBuilding.statuses?.map((status) => (
                          <li key={status._id}>
                            {status.status_id?.status_name}
                          </li>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <th>Building During the Reign</th>
                      <td>{foundBuilding.bdr_id?.bdr_name}</td>
                    </tr>
                    <tr>
                      <th>Documentation Date</th>
                      <td>{foundBuilding.documentationDate}</td>
                    </tr>
                    <tr>
                      <th>Number of Floors</th>
                      <td>{foundBuilding.numberOfFloors}</td>
                    </tr>
                    <tr>
                      <th>Owner's Name</th>
                      <td>
                        {foundBuilding.owners?.map((owner) => (
                          <li key={owner._id}>{owner.owner_id?.owner_name}</li>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <th>Tenant</th>
                      <td>
                        {foundBuilding.tenants?.map((tenant) => (
                          <li key={tenant._id}>
                            {tenant.tenant_id?.tenant_name}
                          </li>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <th>Name of Notaries</th>
                      <td>
                        {foundBuilding.notaries?.map((notary) => (
                          <li key={notary._id}>
                            {notary.notary_id?.notary_name}
                          </li>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {foundBuilding.architects?.length > 0 && (
              <SwiperBuildings architects={foundBuilding?.architects} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BuildingDetails;
