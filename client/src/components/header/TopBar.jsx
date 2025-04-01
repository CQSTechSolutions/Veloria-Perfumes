import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const TopBar = () => {
  const messages = [
    "Free Shipping On Orders Above ₹499 | Shop Now!",
    "Get 10% Off On Your First Order!",
    "Exclusive Offers For Members Only!"
  ];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <div className="bg-burgundy text-soft-white py-2 text-center text-xs sm:text-sm tracking-wider font-sans">
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5000}
        showDots={false}
        removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
        containerClass="container-with-dots"
        itemClass="px-4"
      >
        {messages.map((message, index) => (
          <div key={index} className="flex items-center justify-center">
            <span className="hidden sm:inline-block mr-2 text-gold">✦</span>
            <p className="truncate">{message}</p>
            <span className="hidden sm:inline-block ml-2 text-gold">✦</span>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default TopBar; 