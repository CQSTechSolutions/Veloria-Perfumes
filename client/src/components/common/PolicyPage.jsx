import React from 'react';
import { motion } from 'framer-motion';

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

/**
 * Reusable component for policy pages with consistent styling
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle
 * @param {Array} props.sections - Array of sections with title and content
 */
const PolicyPage = ({ title, subtitle, sections }) => {
  return (
    <div className="min-h-screen bg-cream paper-texture">
      <div className="relative container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif mb-4 text-burgundy">
            {title}
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto mb-6" />
          <p className="text-xl text-soft-black/70">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto space-y-8"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-soft-white border border-gold/10 shadow-sm p-6"
            >
              <h2 className="text-2xl font-serif text-burgundy mb-4">
                {section.title}
              </h2>
              <div className="prose prose-lg text-soft-black/80">
                {typeof section.content === 'string' ? (
                  <p>{section.content}</p>
                ) : (
                  section.content
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12 text-soft-black/50 text-sm">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage; 