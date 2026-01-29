import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { jwtDecode } from 'jwt-decode';

export default function Orders() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);

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
  }, [navigate]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', userEmail],
    queryFn: () => base44.entities.Order.filter({ buyerEmail: userEmail }, '-created_date'),
    enabled: !!userEmail,
  });

  if (isLoading || !userEmail) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">My Orders</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#49EACB]/30 transition"
              >
                <div className="flex gap-6">
                  {order.productImage ? (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      <img src={order.productImage} alt={order.productName} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-white/30" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{order.productName}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-white/40">Quantity:</span>
                        <span className="text-white ml-2">{order.quantity}</span>
                      </div>
                      <div>
                        <span className="text-white/40">Total:</span>
                        <span className="text-[#49EACB] ml-2 font-semibold">{order.totalPrice} KAS</span>
                      </div>
                      <div>
                        <span className="text-white/40">Date:</span>
                        <span className="text-white ml-2">{new Date(order.created_date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-white/40">Status:</span>
                        <span className="text-green-400 ml-2 capitalize">{order.status}</span>
                      </div>
                    </div>

                    {order.transactionId && (
                      <a
                        href={`https://explorer.kaspa.org/txs/${order.transactionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-[#49EACB] transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Transaction
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/40 text-xs">Seller Address:</p>
                  <p className="text-white/60 text-xs font-mono mt-1 break-all">{order.sellerWalletAddress}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-lg">No orders yet</p>
            <p className="text-white/30 text-sm mt-2">Your purchases will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}