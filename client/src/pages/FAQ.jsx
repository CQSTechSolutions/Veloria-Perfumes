import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import faq from '../data/faq.json';
import { FaChevronDown } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    
    return (
        <div className="min-h-screen bg-cream paper-texture">
            <div className="relative container mx-auto px-4 py-8 sm:py-12 md:py-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 sm:mb-12 md:mb-16"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-3 md:mb-4 text-burgundy">
                        Frequently Asked Questions
                    </h1>
                    <div className="w-16 sm:w-20 md:w-24 h-0.5 md:h-1 bg-gold mx-auto mb-4 md:mb-6" />
                    <p className="text-base sm:text-lg md:text-xl text-soft-black/70 px-2">
                        Find answers to common questions about our fragrances
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="max-w-4xl mx-auto space-y-3 sm:space-y-4"
                >
                    {faq.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-soft-white border border-gold/10 shadow-sm"
                        >
                            <div
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="p-4 sm:p-5 md:p-6 flex justify-between items-center cursor-pointer group"
                            >
                                <h2 className="text-base sm:text-lg md:text-xl font-serif text-soft-black group-hover:text-burgundy transition-colors pr-4">
                                    {item.question}
                                </h2>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0"
                                >
                                    <FaChevronDown className="text-gold text-sm sm:text-base md:text-xl" />
                                </motion.div>
                            </div>
                            
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ 
                                            height: "auto", 
                                            opacity: 1,
                                            transition: {
                                                height: {
                                                    duration: 0.4,
                                                },
                                                opacity: {
                                                    duration: 0.3,
                                                    delay: 0.1
                                                }
                                            }
                                        }}
                                        exit={{ 
                                            height: 0, 
                                            opacity: 0,
                                            transition: {
                                                height: {
                                                    duration: 0.4
                                                },
                                                opacity: {
                                                    duration: 0.3
                                                }
                                            }
                                        }}
                                    >
                                        <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 text-soft-black/70 text-sm sm:text-base">
                                            {item.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default FAQ;