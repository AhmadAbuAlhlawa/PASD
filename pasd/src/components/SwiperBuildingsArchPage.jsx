import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../css/Swiper.css';
import { useEffect } from 'react';

const SwiperBuildingsArchPage = ({ buildings }) => {
  return (
    <div>
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
        {buildings?.map((building) => (
          <SwiperSlide key={building._id}>
            <a href={`/Buildings/${building._id}`} className="slider-image-container">
              <div className="slider-overlay">
                <h4 className="building-name">{building.building_name}</h4>
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
                  src="https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
                  alt="No image available"
                  className="slider-image"
                />
              )}
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperBuildingsArchPage;
