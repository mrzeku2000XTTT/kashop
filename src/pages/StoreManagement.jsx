import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { jwtDecode } from 'jwt-decode';
import StoreCreatorForm from '../components/StoreCreatorForm';

export default function StoreManagement() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
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
    onSuccess: (newStore) => {
      queryClient.invalidateQueries({ queryKey: ['stores', userEmail] });
      setShowCreateForm(false);
      setSelectedStore(newStore);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Store.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores', userEmail] });
      setSelectedStore(null);
    },
  });

  const handleCreateStore = (data) => {
    const generateMerchantId = () => {
      const emailPart = userEmail.split('@')[0];
      const timestamp = Date.now();
      return `kpm_${emailPart}_${timestamp}`;
    };

    createMutation.mutate({
      name: data.name,
      description: data.description,
      coverImage: data.coverImage,
      storeType: data.storeType,
      country: data.country,
      city: data.city,
      offerDelivery: data.offerDelivery,
      merchantId: generateMerchantId(),
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
          {selectedStore.coverImage && (
            <div className="relative w-full h-48 overflow-hidden bg-white/5">
              <img src={selectedStore.coverImage} alt={selectedStore.name} className="w-full h-full object-cover" />
            </div>
          )}
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
                onClick={() => navigate(createPageUrl('StoreProducts') + `?storeId=${selectedStore.id}`)}
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
        {showCreateForm && (
          <StoreCreatorForm
            onSubmit={handleCreateStore}
            onCancel={() => setShowCreateForm(false)}
            isLoading={createMutation.isPending}
          />
        )}

        {!showCreateForm && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-white/80">Manage your stores</h2>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Store
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map(store => (
                <button
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-[#49EACB]/30 transition text-left group"
                >
                  {store.coverImage ? (
                    <div className="relative w-full h-32 overflow-hidden bg-white/5">
                      <img src={store.coverImage} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                      <Package className="w-8 h-8 text-white/30" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{store.name}</h3>
                    {store.description && (
                      <p className="text-white/60 text-sm line-clamp-2">{store.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {stores.length === 0 && (
              <div className="text-center py-12 text-white/40">
                <p>No stores yet. Create your first store to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}