import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ChevronRight, Shield, Zap, Globe, ShoppingCart, X, ArrowLeft, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Home() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showBuyKas, setShowBuyKas] = useState(false);
  const [showKaspacom, setShowKaspacom] = useState(false);

  useEffect(() => {
    // Load KasperoPay widget script
    const script = document.createElement('script');
    script.src = 'https://kaspa-store.com/pay/widget.js';
    script.async = true;
    
    script.onload = () => {
      console.log('KasperoPay widget loaded successfully');
      
      // Handle Keystone OAuth callback
      const params = new URLSearchParams(window.location.search);
      const keystoneConnected = params.get('keystone_connected');
      const token = params.get('token');

      if (keystoneConnected === 'true' && token) {
        console.log('Keystone OAuth callback detected');
        
        // Store token
        localStorage.setItem('auth_token', token);
        
        // Decode token to get user data
        try {
          const decoded = jwtDecode(token);
          console.log('Decoded token:', decoded);
          
          // Keystone user has email, we'll use that as identifier
          if (decoded.email) {
            setWalletAddress(decoded.email);
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
        
        setIsConnecting(false);
        
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        // Check if already connected (returning user)
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          try {
            const decoded = jwtDecode(storedToken);
            if (decoded.email) {
              setWalletAddress(decoded.email);
            }
          } catch (error) {
            console.error('Failed to decode stored token:', error);
            localStorage.removeItem('auth_token');
          }
        } else if (window.KasperoPay && window.KasperoPay.isConnected && window.KasperoPay.isConnected()) {
          const user = window.KasperoPay.getUser();
          if (user && user.address) {
            setWalletAddress(user.address);
          }
        }
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load KasperoPay widget');
      setIsConnecting(false);
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const connectWallet = () => {
    setIsConnecting(true);
    
    // Check if KasperoPay is loaded
    if (!window.KasperoPay) {
      console.error('KasperoPay not loaded yet. Please refresh the page.');
      setIsConnecting(false);
      return;
    }

    try {
      window.KasperoPay.connect({
        merchant: 'kpm_vx7c48go',
        onConnect: function(user) {
          console.log('✅ Wallet connected!', user);
          if (user && user.address) {
            setWalletAddress(user.address);
          }
          setIsConnecting(false);
        },
        onCancel: function() {
          console.log('❌ Connection cancelled');
          setIsConnecting(false);
        }
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    try {
      if (window.KasperoPay && window.KasperoPay.disconnect) {
        window.KasperoPay.disconnect();
      }
      localStorage.removeItem('auth_token');
      setWalletAddress(null);
    } catch (error) {
      console.error('Disconnect error:', error);
      localStorage.removeItem('auth_token');
      setWalletAddress(null);
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* KasperoPay widget container */}
      <div 
        id="kaspero-pay-button"
        data-merchant="kpm_vx7c48go"
        style={{ display: 'none' }}
      />

      {/* Gradient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#49EACB]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#49EACB]/3 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-50">
        <nav className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697a20c3d4a49d80e84fbf09/0927799b1_image.png"
                alt="KaShop"
                className="h-12 w-12 object-contain"
              />
            </motion.div>

            {/* Navigation Links */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden md:flex items-center gap-8"
            >
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-sm text-white/60 hover:text-white transition-colors">About</a>
              <a href="#docs" className="text-sm text-white/60 hover:text-white transition-colors">Docs</a>
            </motion.div>

            {/* Cart, Settings, and Connect Wallet Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/5 rounded-full w-10 h-10 p-0"
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>

              {walletAddress ? (
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-mono">
                    {truncateAddress(walletAddress)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-white/70 hover:text-white hover:bg-white/5 rounded-full w-10 h-10 p-0"
                      >
                        <SettingsIcon className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10">
                      <DropdownMenuItem onClick={() => navigate(createPageUrl('StoreManagement'))} className="text-white cursor-pointer hover:bg-white/5">
                        My Stores
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(createPageUrl('Settings'))} className="text-white cursor-pointer hover:bg-white/5">
                        Account
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={disconnectWallet} className="text-red-400 cursor-pointer hover:bg-red-500/10">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-medium md:px-6 px-3 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#49EACB]/20"
                >
                  <Wallet className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </span>
                </Button>
              )}
            </motion.div>
          </div>
        </nav>

        {/* Subheader */}
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-white/50">
                <a href="#products" className="hover:text-white transition-colors">Products</a>
                <a href="#deals" className="hover:text-white transition-colors">Deals</a>
                <a href="#categories" className="hover:text-white transition-colors">Categories</a>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowBuyKas(true)}
                  className="bg-gradient-to-r from-orange-500 to-blue-500 hover:opacity-90 text-white font-medium px-6 py-2 rounded-full text-sm"
                >
                  Buy KAS
                </Button>
                <Button
                  onClick={() => setShowKaspacom(true)}
                  className="bg-white/5 hover:bg-white/10 border border-[#49EACB]/30 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  title="Kaspacom"
                >
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697a20c3d4a49d80e84fbf09/c07a8382d_image.png"
                    alt="Kaspacom"
                    className="w-5 h-5 object-contain"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Buy KAS Modal */}
      <Dialog open={showBuyKas} onOpenChange={setShowBuyKas}>
        <DialogContent className="w-screen h-screen max-w-full md:max-w-[95vw] md:w-[95vw] md:h-[95vh] p-0 bg-[#0a0a0a] border-white/10 flex flex-col md:rounded-lg overflow-hidden">
          <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowBuyKas(false)}
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/5 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <DialogTitle className="text-white text-lg md:text-xl">Buy KAS</DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <iframe
              src="https://kaspa-ng-62ab4fc0.base44.app"
              className="w-full h-full border-0"
              title="Buy KAS"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Kaspacom Modal */}
      <Dialog open={showKaspacom} onOpenChange={setShowKaspacom}>
        <DialogContent className="w-screen h-screen max-w-full md:max-w-[95vw] md:w-[95vw] md:h-[95vh] p-0 bg-[#0a0a0a] border-white/10 flex flex-col md:rounded-lg overflow-hidden">
          <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowKaspacom(false)}
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/5 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <DialogTitle className="text-white text-lg md:text-xl">Kaspacom</DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <iframe
              src="https://wallet.kaspa.com/onboarding"
              className="w-full h-full border-0"
              title="Kaspacom"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 md:pt-32 md:pb-40">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#49EACB] animate-pulse" />
                Powered by Kaspa Network
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              The Future of
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#49EACB] to-[#49EACB]/60">
                Crypto Payments
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/50 max-w-xl mx-auto mb-12 leading-relaxed"
            >
              Fast, secure, and seamless transactions on the Kaspa blockchain. 
              Connect your wallet and experience instant payments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {!walletAddress ? (
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-semibold md:px-8 px-6 py-6 md:text-lg text-base rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#49EACB]/25 hover:scale-105"
                >
                  <Wallet className="w-5 h-5 md:mr-2" />
                  <span className="hidden md:inline">
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </span>
                </Button>
              ) : (
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-[#49EACB]/30">
                  <div className="w-3 h-3 rounded-full bg-[#49EACB] animate-pulse" />
                  <span className="text-[#49EACB] font-medium">Wallet Connected</span>
                </div>
              )}
              
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/5 px-6 py-6 text-lg rounded-full group"
              >
                Learn More
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Instant Transactions',
                description: 'Sub-second confirmation times powered by Kaspa\'s blockDAG technology.'
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your transactions are protected by enterprise-grade cryptographic security.'
              },
              {
                icon: Globe,
                title: 'Global Access',
                description: 'Send and receive payments anywhere in the world, no borders.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#49EACB]/20 transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#49EACB]/10 flex items-center justify-center mb-6 group-hover:bg-[#49EACB]/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#49EACB]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697a20c3d4a49d80e84fbf09/0927799b1_image.png"
                alt="KaShop"
                className="h-10 w-10 object-contain"
              />
              <span className="text-sm text-white/40">© 2025 KaShop. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}