import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductCard({ product, onEdit, onDelete }) {
  const [imageIndex, setImageIndex] = useState(0);

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-[#49EACB]/30 transition">
      {/* Image Gallery */}
      <div className="relative w-full h-48 bg-black">
        {product.images && product.images.length > 0 ? (
          <>
            <img
              src={product.images[imageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-1.5 rounded-full text-white transition z-10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-1.5 rounded-full text-white transition z-10"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition ${
                        idx === imageIndex ? 'bg-[#49EACB]' : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40">
            No images
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-white">{product.name}</h3>
            {product.category && (
              <p className="text-white/40 text-xs">{product.category}</p>
            )}
          </div>
        </div>

        {product.description && (
          <p className="text-white/60 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-[#49EACB] font-semibold">{product.price} KAS</p>
            {product.stock !== undefined && (
              <p className="text-white/40 text-xs">Stock: {product.stock}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(product)}
            variant="ghost"
            size="sm"
            className="flex-1 text-[#49EACB] hover:text-[#49EACB] hover:bg-[#49EACB]/10 text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            onClick={() => onDelete(product.id)}
            variant="ghost"
            size="sm"
            className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}