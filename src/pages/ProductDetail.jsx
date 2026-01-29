import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, ShoppingCart, Copy, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createPageUrl } from '../utils';
import { jwtDecode } from 'jwt-decode';

export default function ProductDetail() {
  const navigate = useNavigate();
  const [productId, setProductId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [buyerWalletAddress, setBuyerWalletAddress] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStartTime, setVerificationStartTime] = useState(null);
  const [showKaspacom, setShowKaspacom] = useState(false);

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


  }, []);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const prod = await base44.entities.Product.get(productId);
      return prod;
    },
    enabled: !!productId,
  });

  const handleCheckout = () => {
    if (!product.walletAddress) {
      alert('Seller wallet address not configured');
      return;
    }

    if (quantity < 1 || quantity > (product.stock || 0)) {
      alert('Invalid quantity');
      return;
    }

    setShowPaymentModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Address copied to clipboard!');
  };

  const handleStartVerification = async () => {
    const timestamp = Date.now();
    setVerificationStartTime(timestamp);
    setIsVerifying(true);

    const checkTransaction = async () => {
      try {
        const response = await base44.functions.invoke('verifyKaspaTransaction', {
          address: product.walletAddress,
          expectedAmount: parseFloat(totalPrice),
          timestamp: timestamp
        });

        if (response.data?.verified) {
          setIsVerifying(false);
          setShowPaymentModal(false);
          
          // Update product stock
          const newStock = (product.stock || 0) - quantity;
          await base44.entities.Product.update(product.id, { stock: newStock });
          
          // Show subtle notification
          const notif = document.createElement('div');
          notif.className = 'fixed bottom-6 right-6 bg-black/90 border border-[#49EACB]/30 rounded-lg p-4 shadow-2xl z-[9999] max-w-sm';
          notif.innerHTML = `
            <p class="text-[#49EACB] text-sm font-semibold mb-2">✅ Payment Verified!</p>
            <a href="https://explorer.kaspa.org/txs/${response.data.txid}" target="_blank" 
               class="text-white/60 text-xs hover:text-[#49EACB] underline break-all">
              ${response.data.txid}
            </a>
          `;
          document.body.appendChild(notif);
          
          setTimeout(() => {
            notif.remove();
            if (newStock <= 0) {
              navigate('/');
            } else {
              window.location.reload();
            }
          }, 5000);
        } else {
          setTimeout(checkTransaction, 3000); // Poll every 3 seconds
        }
      } catch (err) {
        console.error('Verification error:', err);
        setTimeout(checkTransaction, 3000);
      }
    };

    checkTransaction();
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
                  disabled={!product.stock || quantity > product.stock}
                  className="w-full bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-semibold py-6 text-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
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

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={(open) => {
        if (!isVerifying) {
          setShowPaymentModal(open);
        }
      }}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-md">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Complete Payment</h2>
              {!isVerifying && (
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {!isVerifying ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-white/60 text-sm mb-2">Product</p>
                  <p className="text-white font-semibold">{product.name} (x{quantity})</p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-white/60 text-sm mb-2">Amount to Pay</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#49EACB]">{totalPrice}</span>
                    <span className="text-xl text-white/60">KAS</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-white/60 text-sm mb-3">Send payment to seller's address:</p>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white font-mono text-sm break-all mb-3">
                      {product.walletAddress}
                    </p>
                    <Button
                      onClick={() => copyToClipboard(product.walletAddress)}
                      className="w-full bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-semibold"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Address
                    </Button>
                  </div>
                </div>

                <div className="bg-[#49EACB]/10 border border-[#49EACB]/20 rounded-lg p-4">
                  <p className="text-[#49EACB] text-sm mb-3">
                    📝 <strong>Instructions:</strong>
                  </p>
                  <ol className="text-white/60 text-xs space-y-1 list-decimal list-inside">
                    <li>Copy the seller's address above</li>
                    <li>Click "Start Verification" below</li>
                    <li>Send exactly <strong className="text-[#49EACB]">{totalPrice} KAS</strong> from your wallet</li>
                    <li>Wait for automatic verification</li>
                  </ol>
                </div>

                <Button
                  onClick={handleStartVerification}
                  className="w-full bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-semibold py-6"
                >
                  Start Verification
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-[#49EACB]/30 border-t-[#49EACB] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#49EACB] font-semibold text-lg mb-2">Waiting for Payment...</p>
                <p className="text-white/60 text-sm mb-4">
                  Send <strong>{totalPrice} KAS</strong> to the address below
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                  <p className="text-white text-xs font-mono break-all">
                    {product.walletAddress}
                  </p>
                </div>
                
                <Button
                  onClick={() => setShowKaspacom(true)}
                  className="w-full bg-white/10 hover:bg-white/20 border border-[#49EACB]/30 text-white mb-4"
                >
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697a20c3d4a49d80e84fbf09/c07a8382d_image.png"
                    alt="Kaspacom"
                    className="w-5 h-5 mr-2"
                  />
                  Pay with Kaspacom Wallet
                </Button>

                <p className="text-white/40 text-xs">
                  Checking blockchain every 3 seconds...
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Kaspacom Wallet Modal */}
      <Dialog open={showKaspacom} onOpenChange={setShowKaspacom}>
        <DialogContent className="w-screen h-screen max-w-full md:max-w-[95vw] md:w-[95vw] md:h-[95vh] p-0 bg-[#0a0a0a] border-white/10 flex flex-col md:rounded-lg overflow-hidden">
          <div className="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4 border-b border-white/10 flex-shrink-0 flex items-center gap-3">
            <button
              onClick={() => setShowKaspacom(false)}
              className="text-white/70 hover:text-white hover:bg-white/5 rounded-full p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-white text-lg md:text-xl font-semibold">Kaspacom Wallet</h2>
            <span className="text-white/50 text-xs md:text-sm ml-auto">Send payment from wallet</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              src="https://wallet.kaspa.com/onboarding"
              className="w-full h-full border-0"
              title="Kaspacom Wallet"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation allow-top-navigation-by-user-activation"
              allow="clipboard-read; clipboard-write"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}