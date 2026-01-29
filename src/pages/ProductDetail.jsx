import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPageUrl } from '../utils';
import { jwtDecode } from 'jwt-decode';

export default function ProductDetail() {
  const navigate = useNavigate();
  const [productId, setProductId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [userWalletAddress, setUserWalletAddress] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setProductId(id);

    // Get user's wallet address from token
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserWalletAddress(decoded.address);
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
    if (!userWalletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    if (quantity < 1 || quantity > (product.stock || 0)) {
      alert('Invalid quantity');
      return;
    }

    setShowPayment(true);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(userWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkPayment = async () => {
    const totalAmount = parseFloat((product.price * quantity).toFixed(8));
    const timestamp = Date.now();
    setCheckingPayment(true);

    const pollTransaction = async () => {
      try {
        const response = await base44.functions.invoke('verifyKaspaSelfTransaction', {
          address: userWalletAddress,
          expectedAmount: totalAmount,
          timestamp: timestamp
        });

        if (response.data?.verified) {
          setPaymentConfirmed(true);
          setCheckingPayment(false);
          alert(`✅ Payment verified! Transaction ID: ${response.data.txid}`);
          setTimeout(() => navigate('/'), 2000);
        } else {
          setTimeout(pollTransaction, 3000); // Poll every 3 seconds
        }
      } catch (error) {
        console.error('Verification error:', error);
        setTimeout(pollTransaction, 3000); // Continue polling on error
      }
    };

    pollTransaction();
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

                {!showPayment ? (
                  <Button
                    onClick={handleCheckout}
                    disabled={!product.stock || quantity > product.stock}
                    className="w-full bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-semibold py-6 text-lg"
                  >
                    Proceed to Payment
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                      <p className="text-cyan-400 text-sm font-semibold mb-3">ZK Verification (iOS)</p>
                      <p className="text-white/60 text-xs mb-4">Send {totalPrice} KAS to yourself in Kaspium to verify this purchase</p>
                      
                      <div className="bg-white/5 rounded-lg p-3 mb-4">
                        <p className="text-white/40 text-xs mb-1">Your Wallet Address</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-white/80 break-all flex-1 font-mono">
                            {userWalletAddress}
                          </code>
                          <Button
                            onClick={copyAddress}
                            size="icon"
                            variant="ghost"
                            className="flex-shrink-0 text-white/60 hover:text-white"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                        <ol className="text-white/60 text-xs space-y-1 list-decimal list-inside">
                          <li>Copy your wallet address above</li>
                          <li>Click "I Have Sent Payment"</li>
                          <li>Open Kaspium and send {totalPrice} KAS to your own address</li>
                          <li>Wait for automatic verification</li>
                        </ol>
                      </div>
                    </div>

                    {paymentConfirmed ? (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                        <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-green-500 font-semibold">Payment Verified!</p>
                        <p className="text-white/60 text-xs mt-1">Your purchase is confirmed</p>
                      </div>
                    ) : checkingPayment ? (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-cyan-400 font-semibold mb-2">Waiting for Transaction...</p>
                        <p className="text-white/60 text-sm">Send {totalPrice} KAS to yourself in Kaspium</p>
                      </div>
                    ) : (
                      <Button
                        onClick={checkPayment}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-4"
                      >
                        I Have Sent Payment
                      </Button>
                    )}

                    <Button
                      onClick={() => setShowPayment(false)}
                      variant="ghost"
                      className="w-full text-white/60 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/60 text-sm mb-2">Payment Method</p>
              <p className="text-white/80 text-xs">Zero-Knowledge Self-Send Verification</p>
              <p className="text-white/40 text-xs mt-1">Seller receives: {product.walletAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}