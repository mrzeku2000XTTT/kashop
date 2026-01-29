import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createPageUrl } from '../utils';

export default function Products() {
  const navigate = useNavigate();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => base44.entities.Product.list(),
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5">
        <div className="relative w-full h-48 bg-gradient-to-br from-[#49EACB]/20 via-purple-500/10 to-blue-500/10">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>
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
            <div>
              <h1 className="text-2xl font-bold">All Products</h1>
              <p className="text-white/60 text-sm mt-1">Browse products from all stores</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="text-center py-12 text-white/40">
            <p>Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-[#49EACB]/30 transition cursor-pointer group"
              >
                {product.images && product.images.length > 0 ? (
                  <div className="relative w-full h-48 overflow-hidden bg-white/5">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition" 
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                    <Package className="w-12 h-12 text-white/30" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                  {product.category && (
                    <p className="text-[#49EACB] text-xs mb-2">{product.category}</p>
                  )}
                  {product.description && (
                    <p className="text-white/60 text-sm line-clamp-2 mb-3">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[#49EACB] font-semibold">{product.price} KAS</span>
                    <span className="text-white/50 text-sm">Stock: {product.stock || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/40">
            <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p>No products available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}