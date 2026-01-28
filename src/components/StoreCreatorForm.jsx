import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, AlertCircle, Upload, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function StoreCreatorForm({ onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '',
    coverImage: '',
    storeType: 'physical',
    country: '',
    city: '',
    offerDelivery: true,
    storeName: ''
  });
  const [errors, setErrors] = useState({});

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setFormData(prev => ({ ...prev, coverImage: file_url }));
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  const features = [
    'Accept payments in Kaspa using KasperoPay Wallet',
    'Sell physical products with delivery support',
    'Get your own store page on kaShop',
    'Manage products and orders in one place'
  ];

  const benefits = [
    'You own this store',
    'No platform fees',
    'No hidden charges',
    'Full control over your business'
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#49EACB]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#49EACB]/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Create Your Store
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Start selling products and accept Kaspa payments in minutes
          </p>
        </motion.div>

        {/* Store Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-2">Store Details</h2>
          <p className="text-white/50 text-sm mb-8">
            This information will be visible to customers
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Cover Image */}
            <div>
              <label className="text-white text-sm font-medium block mb-3">
                Store Cover Image
              </label>
              {formData.coverImage ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                  <img src={formData.coverImage} alt="Store cover" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="block w-full border-2 border-dashed border-white/20 rounded-lg p-8 hover:border-[#49EACB]/50 cursor-pointer transition text-center">
                  <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                  <p className="text-white/60">Click to upload store cover image</p>
                  <p className="text-white/40 text-xs mt-1">PNG, JPG up to 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              <p className="text-white/40 text-xs mt-2">
                This will be displayed on your store page
              </p>
            </div>

            {/* Store Name */}
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Store Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="Your store name e.g. PowerHub Lagos"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-2">{errors.name}</p>
              )}
              <p className="text-white/40 text-xs mt-2">
                This is how customers will recognize your store
              </p>
            </div>

            {/* Store Description */}
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Store Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What do you sell and who is it for"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none h-24"
              />
              <p className="text-white/40 text-xs mt-2">
                A short description helps customers trust your store
              </p>
            </div>

            {/* Store Type */}
            <div>
              <label className="text-white text-sm font-medium block mb-4">
                Store Type
              </label>
              <div className="space-y-3">
                {[
                  { value: 'physical', label: 'Physical products with delivery', icon: '📦' },
                  { value: 'digital', label: 'Digital products', icon: '💾' },
                  { value: 'both', label: 'Both physical & digital', icon: '🎯' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, storeType: option.value }))}
                    className={`w-full p-4 rounded-lg border text-left transition ${
                      formData.storeType === option.value
                        ? 'border-[#49EACB] bg-[#49EACB]/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{option.icon}</span>
                      <span className="text-white font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-white/40 text-xs mt-2">
                This helps us configure shipping and order flows
              </p>
            </div>

            {/* Store Location */}
            <div>
              <label className="text-white text-sm font-medium block mb-3">
                Store Location
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Input
                    value={formData.country}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, country: e.target.value }));
                      if (errors.country) setErrors(prev => ({ ...prev, country: '' }));
                    }}
                    placeholder="Country"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
                  />
                  {errors.country && (
                    <p className="text-red-400 text-xs mt-1">{errors.country}</p>
                  )}
                </div>
                <div>
                  <Input
                    value={formData.city}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, city: e.target.value }));
                      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
                    }}
                    placeholder="City or Region"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
                  />
                  {errors.city && (
                    <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
              </div>
              <p className="text-white/40 text-xs">
                Used for delivery estimates and customer transparency
              </p>
            </div>

            {/* Delivery Options */}
            {formData.storeType !== 'digital' && (
              <div>
                <label className="text-white text-sm font-medium block mb-3">
                  Delivery Options
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, offerDelivery: !prev.offerDelivery }))}
                  className={`w-full p-4 rounded-lg border text-left transition flex items-center ${
                    formData.offerDelivery
                      ? 'border-[#49EACB] bg-[#49EACB]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition ${
                    formData.offerDelivery ? 'bg-[#49EACB] border-[#49EACB]' : 'border-white/40'
                  }`}>
                    {formData.offerDelivery && <Check className="w-3 h-3 text-black" />}
                  </div>
                  <span className="text-white font-medium">I offer doorstep delivery</span>
                </button>
              </div>
            )}

            {/* What You Get Section */}
            <div className="pt-8 border-t border-white/5">
              <h3 className="text-xl font-semibold mb-6">What You Get</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-[#49EACB]/20 border border-[#49EACB]/40">
                        <Check className="h-3 w-3 text-[#49EACB]" />
                      </div>
                    </div>
                    <span className="text-white/80 text-sm leading-relaxed">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Store Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="bg-white/5 border border-white/10 rounded-lg p-4"
            >
              <p className="text-white/60 text-xs mb-1">Your store page will be available at</p>
              <p className="text-[#49EACB] font-mono text-sm">kashop.io/{formData.name.toLowerCase().replace(/\s+/g, '-') || 'yourstore'}</p>
            </motion.div>

            {/* Payout Wallet */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.44 }}
              className="bg-white/5 border border-white/10 rounded-lg p-4"
            >
              <p className="text-white text-sm font-medium mb-2">Payout Wallet</p>
              <p className="text-white/70 text-sm">Connected via KasperoPay</p>
              <p className="text-white/50 text-xs mt-1">Payments go directly to your wallet</p>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.46 }}
              className="bg-white/5 border border-white/10 rounded-lg p-4"
            >
              <p className="text-white text-sm font-medium mb-3">After creating your store, you'll be able to</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-[#49EACB] mt-0.5">✓</span>
                  <span>Add products and upload photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#49EACB] mt-0.5">✓</span>
                  <span>Set prices in Kaspa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#49EACB] mt-0.5">✓</span>
                  <span>Start accepting orders</span>
                </li>
              </ul>
            </motion.div>

            {/* Ownership Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.48 }}
              className="bg-[#49EACB]/5 border border-[#49EACB]/20 rounded-lg p-6 space-y-3"
            >
              <p className="font-semibold text-white">You own this store</p>
              <div className="space-y-2 text-sm text-white/70">
                <p>No platform fees</p>
                <p>No hidden charges</p>
                <p>Full control over your business</p>
              </div>
            </motion.div>

            {/* Trust & Safety */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
              <p className="text-white/60 text-xs">
                By creating a store, you agree to follow kaShop marketplace guidelines. We're committed to a safe, trustworthy community.
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-3 pt-4"
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-semibold py-3 rounded-lg transition-all duration-200"
              >
                {isLoading ? 'Creating...' : 'Create Store'}
              </Button>
              <Button
                type="button"
                onClick={onCancel}
                variant="ghost"
                className="flex-1 border border-white/10 hover:bg-white/5 text-white font-semibold py-3 rounded-lg transition-all duration-200"
              >
                Cancel
              </Button>
            </motion.div>

            {/* Footer Helper */}
            <p className="text-center text-white/40 text-xs pt-2">
              You can edit your store details anytime
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}