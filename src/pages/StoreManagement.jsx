import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { jwtDecode } from 'jwt-decode';
import StoreCreatorForm from '../components/StoreCreatorForm';

export default function StoreManagement() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.email);
      } catch (error) {
        console.error('Token decode error:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
    setLoading(false);
  }, [navigate]);

  const { data: stores = [] } = useQuery({
    queryKey: ['stores', userEmail],
    queryFn: () => base44.entities.Store.filter({ ownerEmail: userEmail }),
    enabled: !!userEmail,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Store.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores', userEmail] });
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Store.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores', userEmail] });
      setSelectedStore(null);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a store name');
      return;
    }
    createMutation.mutate({
      name: formData.name,
      description: formData.description,
      ownerEmail: userEmail,
    });
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;
  }

  if (selectedStore) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <header className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setSelectedStore(null)}
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/5"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{selectedStore.name}</h1>
                <p className="text-white/60 text-sm mt-1">{selectedStore.description}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Products</h2>
              <Button
                onClick={() => navigate(createPageUrl('StoreProducts'))}
                className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="text-center py-12 text-white/40">
              <p>No products yet. Create your first product to get started.</p>
            </div>

            <Button
              onClick={() => deleteMutation.mutate(selectedStore.id)}
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Store
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">My Stores</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-white/80">Manage your stores</h2>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Store
            </Button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
              <div>
                <label className="text-white text-sm block mb-2">Store Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter store name"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-white text-sm block mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter store description"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black">
                  Create Store
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  variant="ghost"
                  className="text-white/60 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map(store => (
              <button
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-[#49EACB]/30 transition text-left"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{store.name}</h3>
                {store.description && (
                  <p className="text-white/60 text-sm">{store.description}</p>
                )}
              </button>
            ))}
          </div>

          {stores.length === 0 && !showCreateForm && (
            <div className="text-center py-12 text-white/40">
              <p>No stores yet. Create your first store to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}