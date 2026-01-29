import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { jwtDecode } from 'jwt-decode';
import ProductForm from '../components/ProductForm';

export default function AddProduct() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [store, setStore] = useState(null);
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
    queryFn: async () => {
      const store = await base44.entities.Store.get(storeId);
      return store;
    },
    enabled: !!storeId,
  });

  useEffect(() => {
    if (storeData) {
      setStore(storeData);
    }
  }, [storeData]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Product.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', userEmail, storeId] });
      navigate(createPageUrl('StoreProducts') + `?storeId=${storeId}`);
    },
  });

  const handleSaveProduct = (formData) => {
    createMutation.mutate({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      stock: parseFloat(formData.stock) || 0,
      category: formData.category,
      images: formData.images,
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
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(createPageUrl('StoreProducts') + `?storeId=${storeId}`)}
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Add New Product</h1>
              <p className="text-white/60 text-sm mt-1">{store.name}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Product Details</h2>
          <ProductForm
            onSubmit={handleSaveProduct}
            onCancel={() => navigate(createPageUrl('StoreProducts') + `?storeId=${storeId}`)}
            isLoading={createMutation.isPending}
            initialData={null}
          />
        </div>
      </div>
    </div>
  );
}