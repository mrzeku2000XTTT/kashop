import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Shield, Globe, ShoppingCart, Wallet, TrendingUp, Users, Package, Lock, Clock, BarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Features() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: 'Instant Transactions',
      description: 'Sub-second confirmation times powered by Kaspa\'s blockDAG technology. No more waiting for payment confirmations.',
      gradient: 'from-[#49EACB] to-emerald-400'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Enterprise-grade cryptographic security ensures your transactions are protected at all times.',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      icon: Globe,
      title: 'Global Marketplace',
      description: 'Sell and buy from anywhere in the world. No borders, no restrictions, just pure commerce.',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      icon: ShoppingCart,
      title: 'Easy Store Setup',
      description: 'Create your online store in minutes. Add products, set prices, and start selling immediately.',
      gradient: 'from-orange-400 to-red-500'
    },
    {
      icon: Wallet,
      title: 'Direct Payments',
      description: 'Payments go directly to your wallet. No intermediaries, no delays, complete control.',
      gradient: 'from-[#49EACB] to-cyan-400'
    },
    {
      icon: TrendingUp,
      title: 'Low Fees',
      description: 'Minimal transaction fees compared to traditional payment processors. Keep more of your profits.',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a growing community of crypto-native buyers and sellers building the future of commerce.',
      gradient: 'from-violet-400 to-purple-500'
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Track stock levels automatically. Products are hidden when sold out to prevent overselling.',
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      icon: Lock,
      title: 'Blockchain Verification',
      description: 'Every transaction is verified on the Kaspa blockchain, ensuring transparency and trust.',
      gradient: 'from-indigo-400 to-blue-500'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Watch payments arrive in real-time with automatic blockchain verification.',
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      icon: BarChart,
      title: 'Order History',
      description: 'Complete transaction history with blockchain receipts for buyers and sellers.',
      gradient: 'from-teal-400 to-cyan-500'
    },
    {
      icon: Wallet,
      title: 'Multi-Wallet Support',
      description: 'Connect with Kaspacom, Keystone, or any Kaspa-compatible wallet.',
      gradient: 'from-emerald-400 to-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#49EACB]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Built for the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#49EACB] to-[#49EACB]/60">
              Future of Commerce
            </span>
          </h1>
          <p className="text-xl text-white/60 leading-relaxed">
            Experience next-generation e-commerce powered by Kaspa's revolutionary blockchain technology.
          </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="group relative"
            >
              {/* Glass card */}
              <div className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-500 h-full">
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
                
                {/* Content */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative p-12 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-white/60 text-lg mb-8">
            Join thousands of merchants already using kaShop to power their crypto commerce.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-semibold px-8 py-6 text-lg rounded-full"
          >
            Get Started Now
          </Button>
        </motion.div>
      </section>
    </div>
  );
}