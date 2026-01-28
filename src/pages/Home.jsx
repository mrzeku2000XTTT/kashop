import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ChevronRight, Shield, Zap, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Load KasperoPay widget script
    const script = document.createElement('script');
    script.src = 'https://kaspa-store.com/pay/widget.js';
    script.async = true;
    
    script.onload = () => {
      console.log('KasperoPay widget loaded successfully');
      
      // Check if already connected
      if (window.KasperoPay && window.KasperoPay.isConnected && window.KasperoPay.isConnected()) {
        const user = window.KasperoPay.getUser();
        if (user && user.address) {
          setWalletAddress(user.address);
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
        },
        onError: function(error) {
          console.error('Connection error:', error);
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
      setWalletAddress(null);
    } catch (error) {
      console.error('Disconnect error:', error);
      setWalletAddress(null);
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* KasperoPay widget container - Change YOUR_MERCHANT_ID to your actual merchant ID from kaspa-store.com/merchant */}
      <div 
        id="kaspero-pay-button"
        data-merchant="YOUR_MERCHANT_ID"
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#49EACB] to-[#49EACB]/60 flex items-center justify-center">
                <span className="text-black font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">Kaspero</span>
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

            {/* Connect Wallet Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {walletAddress ? (
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-mono">
                    {truncateAddress(walletAddress)}
                  </div>
                  <Button
                    onClick={disconnectWallet}
                    variant="ghost"
                    className="text-white/60 hover:text-white hover:bg-white/5"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-medium px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#49EACB]/20"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              )}
            </motion.div>
          </div>
        </nav>
      </header>

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
                  className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-semibold px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#49EACB]/25 hover:scale-105"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#49EACB] to-[#49EACB]/60 flex items-center justify-center">
                <span className="text-black font-bold text-sm">K</span>
              </div>
              <span className="text-sm text-white/40">© 2025 Kaspero. All rights reserved.</span>
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