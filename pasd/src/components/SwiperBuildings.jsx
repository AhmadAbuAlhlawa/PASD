import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../css/Swiper.css";

const SwiperBuildings = ({ architects }) => {
  // Check if any architect has related buildings
  const hasRelatedBuildings = architects?.some(
    (architect) => architect.architect_id?.relatedBuildings?.length > 0
  );

  // If no architect has related buildings, do not render the section
  if (!hasRelatedBuildings) return null;

  return (
    <div className="architects-section">
      {architects?.map((architect) =>
        architect.architect_id?.relatedBuildings?.length > 0 ? (
          <div key={architect._id} className="architect-container">
            <h3 className="mb-4 mt-4">
              Buildings by <span>{architect.architect_id?.architect_name}</span>
            </h3>
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              pagination={{ clickable: true }}
              navigation={true}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 10 }, // Mobile
                768: { slidesPerView: 2, spaceBetween: 20 }, // Tablet
                1024: { slidesPerView: 3, spaceBetween: 30 }, // Desktop
              }}
              modules={[Pagination, Navigation]}
              className="mySwiper"
            >
              {architect.architect_id?.relatedBuildings?.map((building) => (
                <SwiperSlide key={building._id}>
                  <a
                    href={`/Buildings/${building._id}`}
                    className="slider-image-container"
                  >
                    <div className="slider-overlay">
                      <h4 className="building-name">
                        {building.building_name}
                      </h4>
                      <p className="building-desc">
                        {building.en_description || "No description available"}
                      </p>
                    </div>
                    {building.image?.filename ? (
                      <img
                        src={building.image?.filename}
                        alt={`${building.building_name} image`}
                        className="slider-image"
                      />
                    ) : (
                      <img
                        src="https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg"
                        alt="No image available"
                        className="slider-image"
                      />
                    )}
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : null
      )}
    </div>
  );
};

export default SwiperBuildings;