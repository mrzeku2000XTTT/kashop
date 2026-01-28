import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { jwtDecode } from 'jwt-decode';
import ProductForm from '../components/ProductForm';
import ProductCard from '../components/ProductCard';

export default function StoreProducts() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [store, setStore] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
    queryFn: () => base44.entities.Store.get(storeId),
    enabled: !!storeId,
    onSuccess: (data) => {
      setStore(data);
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
      setShowForm(false);
      setEditingProduct(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Product.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', userEmail, storeId] });
      setShowForm(false);
      setEditingProduct(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', userEmail, storeId] });
    },
  });

  const handleSaveProduct = (formData) => {
    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        data: {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          stock: parseFloat(formData.stock) || 0,
          category: formData.category,
          images: formData.images,
        }
      });
    } else {
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
    }
  };

  if (!store) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5">
        {store.coverImage && (
          <div className="relative w-full h-48 overflow-hidden bg-white/5">
            <img src={store.coverImage} alt={store.name} className="w-full h-full object-cover" />
          </div>
        )}
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
          <h2 className="text-xl font-semibold">Products ({products.length})</h2>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(!showForm);
            }}
            className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {showForm && (
          <ProductForm
            onSubmit={handleSaveProduct}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
            initialData={editingProduct ? {
              name: editingProduct.name,
              description: editingProduct.description,
              price: editingProduct.price.toString(),
              stock: (editingProduct.stock || 0).toString(),
              category: editingProduct.category || '',
              images: editingProduct.images || []
            } : null}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(prod) => {
                setEditingProduct(prod);
                setShowForm(true);
              }}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>

        {products.length === 0 && !showForm && (
          <div className="text-center py-12">
            <p className="text-white/40 mb-4">No products yet. Create your first product to start your store.</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}