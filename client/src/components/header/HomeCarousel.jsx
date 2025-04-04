import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomeCarousel = () => {
  const slides = [
    {
      id: 1,
      image: '/banner.webp',
      title: 'VELORIA',
      subtitle: 'PERFUME',
      buttonText: 'VIEW GIFTS',
      link: '/collections'
    }
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
    <div className="relative">
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5000}
        showDots={true}
        dotListClass="custom-dot-list"
        itemClass="carousel-item"
        containerClass="carousel-container"
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-[60vh] md:h-[90vh] bg-[#f8f3ed]">
            {/* Image */}
            <div className="absolute inset-0">
              <img 
                src={slide.image} 
                alt="Veloria Perfume"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl"
              >
                {/* <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#8B6E4E] mb-4">{slide.title}</h2> */}
                {/* <p className="text-[#8B6E4E] text-2xl md:text-3xl mb-12 font-serif tracking-widest">{slide.subtitle}</p> */}
                {/* <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link 
                    to={slide.link} 
                    className="inline-block bg-[#e9dfd4] text-[#8B6E4E] px-12 py-4 transition-all duration-300 tracking-[0.2em] uppercase text-sm hover:bg-[#8B6E4E] hover:text-white"
                  >
                    {slide.buttonText}
                  </Link>
                </motion.div> */}
              </motion.div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HomeCarousel; 