import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomeCarousel = () => {
  const slides = [
    // {
    //   id: 1,
    //   image: 'https://images.unsplash.com/photo-1616486338812-3dadae405b3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
    //   title: 'Discover Elegance',
    //   subtitle: 'Experience our exclusive collection of luxury fragrances',
    //   buttonText: 'Shop Collection',
    //   link: '/collections'
    // },
    // {
    //   id: 2,
    //   image: 'https://images.unsplash.com/photo-1563170352-898dae651d31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    //   title: 'Sensual & Refined',
    //   subtitle: 'Handcrafted perfumes for the discerning connoisseur',
    //   buttonText: 'Explore Now',
    //   link: '/collections'
    // },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      title: 'Gift of Luxury',
      subtitle: 'Curated gift sets for every special occasion',
      buttonText: 'View Gifts',
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
          <div key={slide.id} className="relative h-[60vh] md:h-[80vh]">
            {/* Image with overlay */}
            <div className="absolute inset-0">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-soft-black/30"></div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl"
              >
                <span className="inline-block mb-3 text-gold text-3xl">✦</span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-soft-white mb-4">{slide.title}</h2>
                <p className="text-soft-white/90 text-lg md:text-xl mb-8 font-sans max-w-2xl mx-auto tracking-wide">{slide.subtitle}</p>
                <Link 
                  to={slide.link} 
                  className="inline-block border border-gold text-soft-white bg-transparent hover:bg-burgundy hover:border-burgundy px-8 py-3 transition-colors duration-300 tracking-wider uppercase text-sm"
                >
                  {slide.buttonText}
                </Link>
              </motion.div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HomeCarousel; 