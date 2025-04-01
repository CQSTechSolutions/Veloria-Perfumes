import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiSave, FiSettings, FiMail, FiPhone, FiMapPin, FiDollarSign, FiPercent, FiTruck, FiFileText, FiInfo } from 'react-icons/fi';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { motion } from 'framer-motion';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    phoneNumber: '',
    address: '',
    currency: 'INR',
    taxRate: '',
    shippingFee: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/settings`
      );

      if (response.data.success) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      toast.error('Failed to fetch settings');
      console.error('Settings fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/settings/update`,
        settings,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        toast.success('Settings updated successfully');
        setSettings(response.data.settings);
      }
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Settings update error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-cream paper-texture">
        <AdminSidebar />
        <div className="flex-1 p-8 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-burgundy border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream paper-texture">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-serif text-burgundy mb-2">Store Settings</h1>
            <p className="text-soft-black/70">Manage your store configurations and preferences</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md border border-gold/20 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-cream to-soft-white p-4 border-b border-gold/10 flex items-center">
              <FiSettings className="text-burgundy mr-2 text-xl" />
              <h2 className="text-lg font-serif text-burgundy">Store Configuration</h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                      <FiInfo className="mr-1.5 text-burgundy" /> Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                      placeholder="Your Store Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                      <FiMail className="mr-1.5 text-burgundy" /> Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                      placeholder="contact@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                      <FiPhone className="mr-1.5 text-burgundy" /> Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.phoneNumber}
                      onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                      className="w-full p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                      placeholder="+91 1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                      <FiDollarSign className="mr-1.5 text-burgundy" /> Currency
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      className="w-full p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                      <FiPercent className="mr-1.5 text-burgundy" /> Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={settings.taxRate}
                      onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                      className="w-full p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                      placeholder="18"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                      <FiTruck className="mr-1.5 text-burgundy" /> Shipping Fee
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-soft-black/70">₹</span>
                      </div>
                      <input
                        type="number"
                        value={settings.shippingFee}
                        onChange={(e) => setSettings({ ...settings, shippingFee: e.target.value })}
                        className="w-full pl-8 p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                        placeholder="100"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                    <FiMapPin className="mr-1.5 text-burgundy" /> Store Address
                  </label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                    placeholder="Enter your store's physical address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                    <FiFileText className="mr-1.5 text-burgundy" /> Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                    placeholder="Brief description of your store for SEO and about pages"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-gold/10">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center px-5 py-2.5 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {saving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Save Settings
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 