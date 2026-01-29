import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, ShoppingCart, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPageUrl } from '../utils';
import { jwtDecode } from 'jwt-decode';

export default function ProductDetail() {
  const navigate = useNavigate();
  const [productId, setProductId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [buyerWalletAddress, setBuyerWalletAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setProductId(id);

    // Get buyer's wallet address from token
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setBuyerWalletAddress(decoded.address || decoded.email);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }

    // Load KasperoPay widget script if not already loaded
    if (!document.getElementById('kaspero-pay-script')) {
      const script = document.createElement('script');
      script.id = 'kaspero-pay-script';
      script.src = 'https://kaspa-store.com/pay/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const prod = await base44.entities.Product.get(productId);
      return prod;
    },
    enabled: !!productId,
  });

  const handleCheckout = async () => {
    if (!product.walletAddress) {
      alert('Seller wallet address not configured');
      return;
    }

    if (quantity < 1 || quantity > (product.stock || 0)) {
      alert('Invalid quantity');
      return;
    }

    setIsProcessing(true);

    try {
      const totalAmount = parseFloat((product.price * quantity).toFixed(2));

      // Check if KasperoPay is loaded
      if (!window.KasperoPay || !window.KasperoPay.pay) {
        alert('Payment system not loaded. Please refresh the page.');
        setIsProcessing(false);
        return;
      }

      // Trigger payment
      window.KasperoPay.pay({
        amount: totalAmount,
        item: `${product.name} (x${quantity})`,
        style: 'dark'
      });

      // Listen for payment completion (set once)
      if (!window._kaspaPaymentListenerSet) {
        window.KasperoPay.onPayment(function(result) {
          if (result.success) {
            alert(`Payment successful! Transaction ID: ${result.txid}`);
            setIsProcessing(false);
            navigate('/');
          } else {
            setIsProcessing(false);
          }
        });
        window._kaspaPaymentListenerSet = true;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Error processing payment: ' + error.message);
      setIsProcessing(false);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const totalPrice = (product.price * quantity).toFixed(8);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hidden KasperoPay widget container - required for initialization */}
      <div 
        id="kaspero-pay-button"
        data-merchant="kpm_hocgtdnj"
        style={{ display: 'none' }}
      />
      
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {product.images && product.images.length > 0 ? (
              <div>
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/5 mb-4">
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                          idx === currentImageIndex
                            ? 'border-[#49EACB]'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                <Package className="w-24 h-24 text-white/30" />
              </div>
            )}
          </div>

          {/* Product Info & Checkout */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <p className="text-[#49EACB] text-sm mb-2">{product.category}</p>
              )}
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              {product.description && (
                <p className="text-white/60 text-lg leading-relaxed">{product.description}</p>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-[#49EACB]">{product.price}</span>
              <span className="text-2xl text-white/60">KAS</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60">In Stock</span>
                <span className="text-white font-semibold">{product.stock || 0} available</span>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-2 block">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  max={product.stock || 0}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock || 0)))}
                  className="bg-white/5 border-white/10 text-white h-12 text-lg"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60">Total</span>
                  <span className="text-2xl font-bold text-[#49EACB]">{totalPrice} KAS</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || !product.stock || quantity > product.stock}
                  className="w-full bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-semibold py-6 text-lg"
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Buy Now
                    </>
                  )}
                </Button>
              </div>
            </div>

            {product.walletAddress && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-2">Payment goes to seller</p>
                <p className="text-white/40 text-xs font-mono break-all">{product.walletAddress}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}