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
            link: 'https://wa.me/917011010256',
            color: 'bg-green-500'
        },
        {
            icon: <FaInstagram className="w-6 h-6" />,
            label: 'Instagram',
            link: 'https://instagram.com/veloria_collections',
            color: 'bg-pink-600'
        },
        {
            icon: <FaFacebookF className="w-6 h-6" />,
            label: 'Facebook',
            link: 'https://facebook.com/veloria_collections',
            color: 'bg-blue-600'
        },
        {
            icon: <FaTwitter className="w-6 h-6" />,
            label: 'Twitter',
            link: 'https://twitter.com/veloria_collections',
            color: 'bg-blue-400'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-r from-red-200 to-red-500 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-800 mb-4"
                    >
                        Get in Touch
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600"
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
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
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
                                    <FiMail className="w-6 h-6 text-red-600" />
                                    <div className="ml-4">
                                        <p className="font-medium">Email Us</p>
                                        <p className="text-sm text-gray-600">contact@veloriacollections.com</p>
                                    </div>
                                </a>
                                <a href="tel:+1234567890" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <FiPhone className="w-6 h-6 text-red-600" />
                                    <div className="ml-4">
                                        <p className="font-medium">Call Us</p>
                                        <p className="text-sm text-gray-600">+91 7011010256</p>
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
            </div>
        </div>
    );
};

export default Contact;
