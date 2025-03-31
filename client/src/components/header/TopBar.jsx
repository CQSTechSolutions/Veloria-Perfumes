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
    <div className="bg-burgundy text-soft-white py-2 text-center text-xs tracking-wider font-sans uppercase">
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5000}
        showDots={false}
        removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
      >
        {messages.map((message, index) => (
          <div key={index} className="flex items-center justify-center">
            <span className="inline-block mr-2 text-gold">✦</span>
            <p>{message}</p>
            <span className="inline-block ml-2 text-gold">✦</span>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default TopBar; 