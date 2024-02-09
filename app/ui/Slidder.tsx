'use client'
import { Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

import 'swiper/css';

export function Slidder() {

  const images = [
    "/login-1.png",
    "/login-2.png",
    "/login-3.png",
    "/login-4.png"
  ];
  return (
    <Swiper
      className="flex-1 items-center justify-center rounded-lg w-full h-full"
      slidesPerView={1}
      navigation
      autoplay
      onSwiper={(swiper) => {
        swiper.autoplay.start()
      }}
      loop={true}
      modules={[EffectFade, Autoplay]} effect="fade"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <Image src={image} className='border-2 border-white rounded-lg w-full h-full object-cover' alt={`Slide ${index}`} width={4160} height={6240} />
        </SwiperSlide>
      ))}
    </Swiper >
  );
};