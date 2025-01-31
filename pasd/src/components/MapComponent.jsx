import React from "react";
import { MapContainer, TileLayer, LayersControl, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const { BaseLayer } = LayersControl;

const MapComponent = ({ buildings }) => {
  return (
    <MapContainer center={[31.7054, 35.2024]} zoom={12} style={{ height: "600px", width: "100%" }}>
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

          // إذا كان هناك صورة للمبنى، نقوم بتعيينها كـ icon
          const buildingImage = building.image?.filename || "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"; // صورة افتراضية إذا لم توجد صورة للمبنى
          const customIcon = new L.Icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconSize: [20, 30], // الحجم المناسب للصورة
            iconAnchor: [10, 15], // تحديد نقطة التثبيت في منتصف الصورة
            popupAnchor: [0, -15], // تحديد مكان نافذة البوب اب
          });

          return (
            <Marker key={building._id} position={[coordinates[0], coordinates[1]]} icon={customIcon}>
              <Popup>
                <div>
                  <h3>{building.building_name}</h3>
                  {/* يمكنك وضع تفاصيل إضافية عن المبنى هنا */}
                  <img src={buildingImage} alt={building.building_name} style={{ width: "100%", height: "auto" }} />
                  <p className="desc_on_map">{building.en_description || "No description available."}</p>
                  <div className="d-flex"><a className="btn btn-small btn-primary text-white m-auto" href={`Buildings/${building._id}`}>Learn more</a></div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </LayersControl>
    </MapContainer>
  );
};

export default MapComponent;