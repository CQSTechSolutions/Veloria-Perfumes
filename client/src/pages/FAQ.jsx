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
        <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-600 to-blue-700">
            {/* Decorative overlay pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] pointer-events-none" />
            
            <div className="relative container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                        Frequently Asked Questions
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mb-6 rounded-full" />
                    <p className="text-xl text-purple-100">
                        Find answers to common questions about our fragrances
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="max-w-4xl mx-auto space-y-4"
                >
                    {faq.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden"
                        >
                            <div
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="p-6 flex justify-between items-center cursor-pointer group"
                            >
                                <h2 className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors">
                                    {item.question}
                                </h2>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <FaChevronDown className="text-purple-300 text-xl" />
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
                                        <div className="px-6 pb-6 text-purple-100">
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