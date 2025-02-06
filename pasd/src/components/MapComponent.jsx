import React from "react";
import { MapContainer, TileLayer, LayersControl, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const { BaseLayer } = LayersControl;

const MapComponent = ({ buildings, page }) => {
  console.log(buildings);
  
  const lastBuilding = buildings[buildings.length - 1];
  console.log(lastBuilding);
  
  const lastBuildingCoordinates = lastBuilding?.address_id?.coordinates;
  console.log(lastBuildingCoordinates);
  
  return (
    <MapContainer center={[lastBuildingCoordinates[0], lastBuildingCoordinates[1]]} zoom={13} style={{ height: "650px", width: "100%" }}>
      <LayersControl position="topright">
        <BaseLayer checked name="Transparent Map">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />      
        </BaseLayer>

        {/* Loop through buildings and place markers */}
        {buildings.map((building) => {
          const coordinates = building.address_id?.coordinates;
          if (!coordinates || coordinates.length !== 2) return null; // Skip invalid coordinates
          
          let buildingImage;

          if (page === "cities") {
            buildingImage = building.image?.filename || "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg";
          }
          
          // إذا كان هناك صورة للمبنى، نقوم بتعيينها كـ icon
          const customIcon = new L.Icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconSize: [20, 30], // الحجم المناسب للصورة
            iconAnchor: [10, 15], // تحديد نقطة التثبيت في منتصف الصورة
            popupAnchor: [0, -15], // تحديد مكان نافذة البوب اب
          });

          return (
            <Marker key={building._id} position={[coordinates[0], coordinates[1]]} icon={customIcon}>
              {page != "buildingDetails" && 
              <Popup maxWidth={200} maxHeight={250} keepInView>
                <div style={{ maxWidth: "200px", maxHeight: "250px", overflow: "hidden" }}>
                  <h3 style={{ fontSize: "14px", marginBottom: "5px" }}>{building.building_name}</h3>
                  <img 
                    src={buildingImage} 
                    alt={building.building_name} 
                    style={{ width: "100%", height: "auto", maxHeight: "120px" }} 
                  />
                  <p style={{ fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {building.en_description || "No description available."}
                  </p>
                  <div className="d-flex">
                    <a className="btn btn-small btn-primary text-white m-auto" href={`/Buildings/${building._id}`}>
                      Learn more
                    </a>
                  </div>
                </div>
              </Popup>
              }
            </Marker>
          );
        })}
      </LayersControl>
    </MapContainer>
  );
};

export default MapComponent;