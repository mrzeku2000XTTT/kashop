import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Trash2, Plus } from 'lucide-react';

export default function Shop({ userEmail }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ['products', userEmail],
    queryFn: () => base44.entities.Product.filter({ ownerEmail: userEmail }),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Product.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', userEmail] });
      setFormData({ name: '', description: '', price: '', imageUrl: '' });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', userEmail] });
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, imageUrl: file_url }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.imageUrl) {
      alert('Please add product name and image');
      return;
    }
    createMutation.mutate({
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null,
      ownerEmail: userEmail,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Products</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
          <div>
            <label className="text-white text-sm block mb-2">Product Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-white text-sm block mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter product description"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-white text-sm block mb-2">Price</label>
            <Input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Enter product price"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-white text-sm block mb-2">Product Image *</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
              {formData.imageUrl ? (
                <div className="space-y-3">
                  <img src={formData.imageUrl} alt="Preview" className="h-32 w-32 object-cover mx-auto rounded" />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <span className="text-[#49EACB] hover:underline text-sm">
                      {uploading ? 'Uploading...' : 'Change image'}
                    </span>
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-white/40" />
                    <div className="text-white/60 text-sm">
                      {uploading ? 'Uploading...' : 'Click to upload image'}
                    </div>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black">
              Add Product
            </Button>
            <Button
              type="button"
              onClick={() => setShowForm(false)}
              variant="ghost"
              className="text-white/60 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-[#49EACB]/30 transition">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
            )}
            <div className="p-4 space-y-2">
              <h3 className="text-white font-semibold">{product.name}</h3>
              {product.description && (
                <p className="text-white/60 text-sm">{product.description}</p>
              )}
              {product.price && (
                <p className="text-[#49EACB] font-medium">${product.price.toFixed(2)}</p>
              )}
              <Button
                onClick={() => deleteMutation.mutate(product.id)}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !showForm && (
        <div className="text-center py-12 text-white/40">
          <p>No products yet. Create your first product to get started.</p>
        </div>
      )}
    </div>
  );
}