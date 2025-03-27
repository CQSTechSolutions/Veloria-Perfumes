import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const HomeCarousel = () => {
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

  const banners = [
    {
      image: "https://png.pngtree.com/png-clipart/20230502/original/pngtree-mens-perfume-aroma-plant-leaves-promotional-web-banner-png-image_9132866.png",
      alt: "Exclusive Perfume Offer",
      link: "/offers"
    },
    // {
    //   image: "https://bellavitaorganic.com/cdn/shop/files/1920-720_188f2f26-2fd1-4903-ac06-ec26cd630e58.jpg?v=1738066786&width=1920",
    //   alt: "New Perfume Collection",
    //   link: "/new-collection"
    // },
    // {
    //   image: "https://bellavitaorganic.com/cdn/shop/files/1920-720_188f2f26-2fd1-4903-ac06-ec26cd630e58.jpg?v=1738066786&width=1920",
    //   alt: "Bestselling Perfume",
    //   link: "/bestsellers"
    // },
    // {
    //   image: "https://bellavitaorganic.com/cdn/shop/files/1920-720_188f2f26-2fd1-4903-ac06-ec26cd630e58.jpg?v=1738066786&width=1920",
    //   alt: "Spring Fragrance",
    //   link: "/spring-fragrance"
    // }
  ];

  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={5000}
      showDots={true}
      removeArrowOnDeviceType={["tablet", "mobile"]}
      className="w-full h-140 bject-cover"
    >
      {banners.map((banner, index) => (
        <div key={index} className="w-full">
          <img
            src={banner.image}
            alt={banner.alt}
            className="w-full h-140 object-cover"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default HomeCarousel; 