import React, { useState } from 'react';
import { FiMail, FiPhone, FiUser, FiMessageSquare, FiSend } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            icon: <FaWhatsapp className="w-6 h-6" />,
            label: 'WhatsApp',
            link: 'https://wa.me/919643169183',
            color: 'bg-green-600'
        },
        {
            icon: <FaInstagram className="w-6 h-6" />,
            label: 'Instagram',
            link: 'https://instagram.com/veloria_collections',
            color: 'bg-pink-700'
        },
        {
            icon: <FaFacebookF className="w-6 h-6" />,
            label: 'Facebook',
            link: 'https://facebook.com/veloria_collections',
            color: 'bg-blue-700'
        },
        {
            icon: <FaTwitter className="w-6 h-6" />,
            label: 'Twitter',
            link: 'https://twitter.com/veloria_collections',
            color: 'bg-blue-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-800 via-teal-600 to-blue-800 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-white mb-4"
                    >
                        Get in Touch
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-200"
                    >
                        We'd love to hear from you. Please fill out the form or reach us through other channels.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow-xl p-6"
                    >
                        <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone (Optional)
                                </label>
                                <div className="relative">
                                    <FiPhone className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="tel"
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Your Phone Number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <div className="relative">
                                    <FiMessageSquare className="absolute left-3 top-3 text-gray-400" />
                                    <textarea
                                        required
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                                className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center gap-2"
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
                        className="space-y-6"
                    >
                        {/* Quick Contact Cards */}
                        <div className="bg-white rounded-lg shadow-xl p-6">
                            <h2 className="text-2xl font-semibold mb-6">Quick Contact</h2>
                            <div className="space-y-4">
                                <a href="mailto:contact@example.com" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <FiMail className="w-6 h-6 text-teal-600" />
                                    <div className="ml-4">
                                        <p className="font-medium">Email Us</p>
                                        <p className="text-sm text-gray-600">contact@veloriacollections.com</p>
                                    </div>
                                </a>
                                <a href="tel:+1234567890" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <FiPhone className="w-6 h-6 text-teal-600" />
                                    <div className="ml-4">
                                        <p className="font-medium">Call Us</p>
                                        <p className="text-sm text-gray-600">+91 9643169183</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="bg-white rounded-lg shadow-xl p-6">
                            {/* <h2 className="text-2xl font-semibold mb-6">Connect With Us</h2> */}
                            <div className="grid grid-cols-4 gap-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`${social.color} text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
                                    >
                                        {social.icon}
                                        <span>{social.label}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="bg-white rounded-lg shadow-xl p-6">
                            <h2 className="text-2xl font-semibold mb-4">Business Hours</h2>
                            <div className="space-y-2">
                                <p className="flex justify-between">
                                    <span className="text-gray-600">Monday - Saturday:</span>
                                    <span className="font-medium">9:00 AM - 9:00 PM</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">Sunday:</span>
                                    <span className="font-medium">9:00 AM - 9:00 PM</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* New Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-lg shadow-xl p-6"
                >
                    <h2 className="text-2xl font-semibold mb-6">Visit Our Store</h2>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-4 mb-4">
                            <div className="bg-teal-100 p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Our Location</h3>
                                <p className="text-gray-600">K P Towers, Sector 1, Noida, Uttar Pradesh 201301</p>
                            </div>
                        </div>
                        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.8615337885626!2d77.30870057581843!3d28.573920375696794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce59804f01a57%3A0xe34b80d40c73dfb8!2sK%20P%20Towers!5e0!3m2!1sen!2sin!4v1741620584203!5m2!1sen!2sin" 
                                className="w-full h-full"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                        {/* <div className="flex justify-center">
                            <a 
                                href="https://goo.gl/maps/YOUR_GOOGLE_MAPS_LINK" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                Get Directions
                            </a>
                        </div> */}
                    </div>
                </motion.div>

                {/* Additional Contact Information
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-lg shadow-xl p-6"
                >
                    <h2 className="text-2xl font-semibold mb-6">Additional Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="font-medium text-gray-900">Parking</h3>
                            <p className="text-gray-600">Free parking available for customers</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-medium text-gray-900">Public Transport</h3>
                            <p className="text-gray-600">Nearest Metro Station: Sector 1 (500m)</p>
                        </div>
                    </div>
                </motion.div> */}
            </div>
        </div>
    );
};

export default Contact;
