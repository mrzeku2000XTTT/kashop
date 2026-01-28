import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { jwtDecode } from 'jwt-decode';

export default function StoreProducts() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [store, setStore] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email);
      } catch (error) {
        navigate('/');
      }
    } else {
      navigate('/');
    }

    const params = new URLSearchParams(window.location.search);
    const storeIdParam = params.get('storeId');
    setStoreId(storeIdParam);
  }, [navigate]);

  const { data: storeData } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => base44.entities.Store.filter({ id: storeId }),
    enabled: !!storeId,
    onSuccess: (data) => {
      if (data.length > 0) setStore(data[0]);
    }
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products', userEmail, storeId],
    queryFn: () => base44.entities.Product.filter({ ownerEmail: userEmail, storeId }),
    enabled: !!userEmail && !!storeId,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Product.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', userEmail, storeId] });
      setFormData({ name: '', description: '', price: '' });
      setImageUrl('');
      setShowAddForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', userEmail, storeId] });
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const response = await base44.integrations.Core.UploadFile({ file });
        setImageUrl(response.file_url);
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }

    createMutation.mutate({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      imageUrl,
      ownerEmail: userEmail,
      storeId,
    });
  };

  if (!store) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(createPageUrl('StoreManagement'))}
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{store.name}</h1>
              <p className="text-white/60 text-sm mt-1">Manage Products</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold">Products</h2>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {showAddForm && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-semibold mb-6">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div>
                <label className="text-white text-sm font-medium block mb-2">Product Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Wireless Headphones"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
                />
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
                  <label className="text-white text-sm font-medium block mb-2">Price (KAS)</label>
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
                  <label className="text-white text-sm font-medium block mb-2">Product Image</label>
                  <label className="flex items-center justify-center w-full h-11 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition">
                    <Upload className="w-4 h-4 mr-2 text-white/60" />
                    <span className="text-white/60 text-sm">{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" disabled={uploading} />
                  </label>
                </div>
              </div>

              {imageUrl && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/10">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-semibold"
                >
                  {createMutation.isPending ? 'Adding...' : 'Add Product'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  variant="ghost"
                  className="flex-1 border border-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-[#49EACB]/30 transition">
              {product.imageUrl && (
                <div className="w-full h-32 overflow-hidden bg-black">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                {product.description && (
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">{product.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[#49EACB] font-semibold">{product.price} KAS</span>
                  <Button
                    onClick={() => deleteMutation.mutate(product.id)}
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !showAddForm && (
          <div className="text-center py-12 text-white/40">
            <p>No products yet. Add your first product to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}