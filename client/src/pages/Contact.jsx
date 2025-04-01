import React, { useState } from 'react';
import { FiMail, FiPhone, FiUser, FiMessageSquare, FiSend, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your form submission logic here
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    const socialLinks = [
        {
            icon: <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />,
            label: 'WhatsApp',
            link: 'https://wa.me/919643169183',
            color: 'bg-burgundy'
        },
        {
            icon: <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />,
            label: 'Instagram',
            link: 'https://instagram.com/veloria_collections',
            color: 'bg-burgundy'
        },
        {
            icon: <FaFacebookF className="w-5 h-5 sm:w-6 sm:h-6" />,
            label: 'Facebook',
            link: 'https://facebook.com/veloria_collections',
            color: 'bg-burgundy'
        },
        {
            icon: <FaTwitter className="w-5 h-5 sm:w-6 sm:h-6" />,
            label: 'Twitter',
            link: 'https://twitter.com/veloria_collections',
            color: 'bg-burgundy'
        }
    ];

    return (
        <div className="min-h-screen bg-cream paper-texture py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
                <div className="text-center mb-8 md:mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-3xl md:text-4xl font-serif text-burgundy mb-3 md:mb-4"
                    >
                        Get in Touch
                    </motion.h1>
                    <div className="w-16 sm:w-20 md:w-24 h-0.5 md:h-1 bg-gold mx-auto mb-4 md:mb-6" />
                    <motion.p 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base sm:text-lg text-soft-black/70"
                    >
                        We'd love to hear from you. Please fill out the form or reach us through other channels.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-soft-white border border-gold/10 shadow-sm p-4 sm:p-6"
                    >
                        <h2 className="text-xl sm:text-2xl font-serif text-burgundy mb-4 md:mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-soft-black/70 mb-1 sm:mb-2">
                                    Name
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-3 text-burgundy/60" />
                                    <input
                                        type="text"
                                        required
                                        className="pl-10 w-full p-2 border border-gold/30 bg-transparent veloria-input"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-soft-black/70 mb-1 sm:mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-3 text-burgundy/60" />
                                    <input
                                        type="email"
                                        required
                                        className="pl-10 w-full p-2 border border-gold/30 bg-transparent veloria-input"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-soft-black/70 mb-1 sm:mb-2">
                                    Phone (Optional)
                                </label>
                                <div className="relative">
                                    <FiPhone className="absolute left-3 top-3 text-burgundy/60" />
                                    <input
                                        type="tel"
                                        className="pl-10 w-full p-2 border border-gold/30 bg-transparent veloria-input"
                                        placeholder="Your Phone Number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-soft-black/70 mb-1 sm:mb-2">
                                    Message
                                </label>
                                <div className="relative">
                                    <FiMessageSquare className="absolute left-3 top-3 text-burgundy/60" />
                                    <textarea
                                        required
                                        className="pl-10 w-full p-2 border border-gold/30 bg-transparent veloria-input"
                                        placeholder="Your Message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full btn-primary flex items-center justify-center gap-2"
                            >
                                <FiSend />
                                Send Message
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4 sm:space-y-6"
                    >
                        {/* Quick Contact Cards */}
                        <div className="bg-soft-white border border-gold/10 shadow-sm p-4 sm:p-6">
                            <h2 className="text-xl sm:text-2xl font-serif text-burgundy mb-4 md:mb-6">Quick Contact</h2>
                            <div className="space-y-3 sm:space-y-4">
                                <a href="mailto:contact@example.com" className="flex items-center p-3 sm:p-4 bg-cream/50 border border-gold/10 hover:border-gold/30 transition-colors">
                                    <FiMail className="w-5 h-5 sm:w-6 sm:h-6 text-burgundy" />
                                    <div className="ml-3 sm:ml-4">
                                        <p className="font-medium text-soft-black text-sm sm:text-base">Email Us</p>
                                        <p className="text-xs sm:text-sm text-soft-black/70">contact@veloriacollections.com</p>
                                    </div>
                                </a>
                                <a href="tel:+1234567890" className="flex items-center p-3 sm:p-4 bg-cream/50 border border-gold/10 hover:border-gold/30 transition-colors">
                                    <FiPhone className="w-5 h-5 sm:w-6 sm:h-6 text-burgundy" />
                                    <div className="ml-3 sm:ml-4">
                                        <p className="font-medium text-soft-black text-sm sm:text-base">Call Us</p>
                                        <p className="text-xs sm:text-sm text-soft-black/70">+91 9643169183</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="bg-soft-white border border-gold/10 shadow-sm p-4 sm:p-6">
                            <h2 className="text-xl sm:text-2xl font-serif text-burgundy mb-4 md:mb-6">Connect With Us</h2>
                            <div className="grid grid-cols-4 gap-2 sm:gap-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`${social.color} text-soft-white p-2 sm:p-4 border border-gold/20 flex items-center justify-center hover:opacity-90 transition-opacity`}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="bg-soft-white border border-gold/10 shadow-sm p-4 sm:p-6">
                            <h2 className="text-xl sm:text-2xl font-serif text-burgundy mb-3 sm:mb-4">Business Hours</h2>
                            <div className="space-y-2">
                                <p className="flex justify-between text-sm sm:text-base">
                                    <span className="text-soft-black/70">Monday - Saturday:</span>
                                    <span className="font-medium text-soft-black">9:00 AM - 9:00 PM</span>
                                </p>
                                <p className="flex justify-between text-sm sm:text-base">
                                    <span className="text-soft-black/70">Sunday:</span>
                                    <span className="font-medium text-soft-black">9:00 AM - 9:00 PM</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-soft-white border border-gold/10 shadow-sm p-4 sm:p-6"
                >
                    <h2 className="text-xl sm:text-2xl font-serif text-burgundy mb-4 md:mb-6">Visit Our Store</h2>
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                            <div className="bg-burgundy/10 p-2">
                                <FiMapPin className="h-5 w-5 sm:h-6 sm:w-6 text-burgundy" />
                            </div>
                            <div>
                                <h3 className="font-medium text-soft-black text-sm sm:text-base">Our Location</h3>
                                <p className="text-soft-black/70 text-xs sm:text-sm">K P Towers, Sector 1, Noida, Uttar Pradesh 201301</p>
                            </div>
                        </div>
                        <div className="aspect-w-16 aspect-h-9 border border-gold/10">
                            <iframe
                                title="Veloria Store Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.4407767781914!2d77.31246791548857!3d28.586962382439246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce45595f0d0c5%3A0xe8f2a5cf73303a0c!2sNoida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1625498767586!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                loading="lazy"
                                style={{ filter: 'grayscale(0.5)' }}
                            ></iframe>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
