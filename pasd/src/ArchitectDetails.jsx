import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import SwiperBuildingsArchPage from './components/SwiperBuildingsArchPage';

import "./css/ArchitectDetails.css";

const ArchitectDetails = () => {
    const { id } = useParams();

    const [foundArchitect, setFoundArchitect] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState("");
    const [zoomLevel, setZoomLevel] = useState(1); // State for zoom level

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:5000/Architects_frontend/${id}`)
            .then((res) => {
                if (!res.ok) {
                    // If the response status is not OK (e.g., 404), throw an error
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json(); // Parse the response if it's OK
            })
            .then((json) => {
                console.log(json);
                setFoundArchitect(json);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                if (error.message.includes("404")) {
                    // Handle 404 specific behavior here
                    console.log("Architect not found (404)");
                    setFoundArchitect(null); // Reset the architect data
                }
                setLoading(false);
            });
    }, [id]);

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
        <div className="arch-container">
            {loading ? (
                <h2>Loading...</h2>
            ) : foundArchitect != null ? ( <>
                <div className="arch_data">
                    <div className="arch_image">
                        {foundArchitect.filename ? (
                            <>
                                <img
                                    src={`${foundArchitect.filename}`}
                                    alt="Architect"
                                    onClick={() => handleOpen(foundArchitect.filename)}
                                    className="clickable-image"
                                />
                                <p>*Click on image for full view</p>
                            </>
                        ) : (
                            <img
                                src="https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
                                alt="No Front Image Available"
                                className="details-image"
                            />
                        )}
                    </div>
                    <div className="arch_info">
                        <h2 className="mb-4">{foundArchitect.architect_name}</h2>
                        <p className="mb-0">{foundArchitect.en_biography}</p>
                    </div>
                </div>
                <div className="my-5">
                    {foundArchitect.buildings?.length === 0 ? 
                    <h3 className="mb-4">No buildings found for this architect</h3>
                    : 
                    <div>
                        <h2>{foundArchitect.buildings.length} building/s</h2>
                        <div>
                            <SwiperBuildingsArchPage buildings={foundArchitect.buildings} />
                        </div>
                    </div>
                    }
                </div>
            </> ) : (
                <h2 className="text-danger">Architect not found</h2>
            )}

            {/* Dialog for viewing the image */}
            <Dialog open={Boolean(selectedImage)} onClose={handleClose} maxWidth="lg">
                <DialogActions>
                    {/* Zoom In Button */}
                    <IconButton onClick={handleZoomIn} title="Zoom In">
                        <ZoomInIcon />
                    </IconButton>
                    {/* Zoom Out Button */}
                    <IconButton onClick={handleZoomOut} title="Zoom Out">
                        <ZoomOutIcon />
                    </IconButton>
                    {/* Close Button */}
                    <IconButton onClick={handleClose} title="Close">
                        <ClearIcon />
                    </IconButton>
                </DialogActions>
                <DialogContent
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "auto", // Prevents scrollbars from appearing
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Selected"
                        style={{
                            transform: `scale(${zoomLevel})`, // Apply zoom level
                            transition: "transform 0.3s ease", // Smooth zoom effect
                            maxWidth: "100%",
                            maxHeight: "100%",
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ArchitectDetails;