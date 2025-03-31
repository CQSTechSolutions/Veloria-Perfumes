import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUser } from 'react-icons/fi';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: 'Sophie Anderson',
      rating: 5,
      comment: "This fragrance is absolutely divine! The notes are so well balanced, and it lasts all day. I've received countless compliments.",
      date: '12 Mar 2023'
    },
    {
      id: 2,
      name: 'James Mitchell',
      rating: 4,
      comment: "Love the scent profile but wish it lasted a bit longer. Still, I find myself reaching for it more than any other perfume in my collection.",
      date: '28 Apr 2023'
    },
    {
      id: 3, 
      name: 'Amelia Patel',
      rating: 5,
      comment: "The packaging is exquisite and the fragrance inside is even better. This has become my signature scent and I'm never going back.",
      date: '7 Jun 2023'
    }
  ];

  return (
    <section className="py-16 px-4 bg-cream/50">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif text-burgundy mb-2">Customer Reviews</h2>
          <div className="w-24 h-px bg-gold mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-soft-white p-6 border border-gold/10 hover:shadow-md transition-shadow duration-300"
            >
              {/* Rating Stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-gold fill-current' : 'text-soft-black/20'}`} 
                  />
                ))}
              </div>
              
              {/* Review Comment */}
              <p className="text-soft-black/80 mb-4 italic font-serif">"{review.comment}"</p>
              
              {/* Review Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy mr-3">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-soft-black">{review.name}</span>
                </div>
                <span className="text-xs text-soft-black/50">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;