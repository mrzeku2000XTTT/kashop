import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ProductForm({ onSubmit, onCancel, isLoading, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    price: '',
    stock: '0',
    category: '',
    images: [],
    walletAddress: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploading(true);
      try {
        const uploadPromises = Array.from(files).map(file => 
          base44.integrations.Core.UploadFile({ file })
        );
        const responses = await Promise.all(uploadPromises);
        const newImageUrls = responses.map(r => r.file_url);
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...newImageUrls]
        }));
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload images. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (formData.images.length === 0) {
      alert('Add at least one product image');
      return;
    }
    if (!formData.walletAddress || !formData.walletAddress.trim()) {
      alert('Kaspa wallet address is required');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
      <h3 className="text-xl font-semibold mb-6">{initialData ? 'Edit Product' : 'Add New Product'}</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-white text-sm font-medium block mb-2">Product Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Wireless Headphones"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
            />
          </div>
          <div>
            <label className="text-white text-sm font-medium block mb-2">Category</label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g. Electronics"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
            />
          </div>
        </div>

        <div>
          <label className="text-white text-sm font-medium block mb-2">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your product..."
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white text-sm font-medium block mb-2">Price (KAS) *</label>
            <Input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="0.00"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
            />
          </div>
          <div>
            <label className="text-white text-sm font-medium block mb-2">Stock</label>
            <Input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              placeholder="0"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
            />
          </div>
        </div>

        <div>
          <label className="text-white text-sm font-medium block mb-2">Kaspa Wallet Address *</label>
          <Input
            value={formData.walletAddress || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
            placeholder="kaspa:..."
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 font-mono text-sm"
          />
          <p className="text-white/40 text-xs mt-2">Enter your Kaspa wallet address to receive payments</p>
        </div>

        <div>
          <label className="text-white text-sm font-medium block mb-3">Product Images *</label>
          <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition">
            <div className="text-center">
              <Upload className="w-5 h-5 text-white/60 mx-auto mb-1" />
              <span className="text-white/60 text-sm">{uploading ? 'Uploading...' : 'Click to upload images'}</span>
            </div>
            <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" multiple disabled={uploading} />
          </label>
          <p className="text-white/40 text-xs mt-2">You can upload multiple images</p>
        </div>

        {formData.images.length > 0 && (
          <div>
            <p className="text-white text-sm font-medium mb-3">{formData.images.length} image(s) added</p>
            <div className="grid grid-cols-4 gap-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Product ${idx}`} className="w-full h-20 object-cover rounded-lg border border-white/10" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 p-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-semibold"
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="ghost"
            className="flex-1 border border-white/10"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}