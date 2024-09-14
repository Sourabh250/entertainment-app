import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/keyboard";
import "swiper/css/mousewheel";
import { Keyboard, Mousewheel } from "swiper/modules";
import MediaCard from "./MediaCard";

const TrendingSlider = ({ trending }) => {
    return (
        <Swiper
          slidesPerView={1.2}
          spaceBetween={30}
          pagination={false} // Disabling pagination dots
          mousewheel={{
            enabled: true,  // Enabling mousewheel scrolling
            sensitivity: 4,
          }}
          modules={[Keyboard, Mousewheel]}
          keyboard={true}  // Enabling keyboard navigation
          className="mySwiper"
          breakpoints={{
            480: {
              slidesPerView: 1.2,
              spaceBetween: 30,
            },
            600: {
              slidesPerView: 2.2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3.5,
              spaceBetween: 40,
            },
          }}
        >
          {
            trending.map((item) => (
              <SwiperSlide
                key={item.id}
                className="flex relative items-center justify-center"
              >
                <MediaCard item={item} isTrending={true} /> {/* Rendering the MediaCard for each trending item */}
              </SwiperSlide>
            ))
          }
        </Swiper>
    )
}

export default TrendingSlider;