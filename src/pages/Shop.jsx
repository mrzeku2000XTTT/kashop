import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Zap, Users, Headphones } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function Shop() {
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
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#49EACB]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#49EACB]/3 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/5"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">KaShop Store</h1>
            </motion.div>
            {userEmail && (
              <Button
                onClick={() => navigate('/storemanagement')}
                className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black"
              >
                My Stores
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#49EACB] animate-pulse" />
              Premium Digital Products
            </span>
            
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Discover<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#49EACB] to-[#49EACB]/60">
                Amazing Products
              </span>
            </h2>
            
            <p className="text-lg text-white/60 mb-8 leading-relaxed">
              Explore our curated collection of digital products and services. Everything you need in one place.
            </p>
            
            <div className="flex gap-4">
              <Button className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black px-8 py-6 text-lg rounded-full">
                Browse Products
              </Button>
              <Button variant="outline" className="border-white/20 hover:bg-white/5 px-8 py-6 text-lg rounded-full">
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block text-center"
          >
            <div className="relative h-96 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-[#49EACB]/20 to-transparent rounded-full blur-3xl" />
              <div className="text-8xl font-bold text-[#49EACB]/10 select-none">KAS</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl font-bold mb-4">What type of products are you looking for?</h3>
          <p className="text-white/60">Browse our categories</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Digital Assets', icon: '🎨' },
            { title: 'Services', icon: '⚙️' },
            { title: 'Courses', icon: '📚' }
          ].map((category, index) => (
            <motion.button
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-lg p-8 hover:border-[#49EACB]/30 transition text-center group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">{category.icon}</div>
              <h4 className="text-xl font-semibold">{category.title}</h4>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl font-bold mb-4">Why choose KaShop</h3>
          <p className="text-white/60">We provide more than high-tech products</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: Shield,
              title: 'Secure Transactions',
              description: 'Protected by enterprise-grade security and blockchain technology'
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Instant delivery and quick checkout process'
            },
            {
              icon: Users,
              title: 'Community Support',
              description: 'Get help from our active community and support team'
            },
            {
              icon: Headphones,
              title: '24/7 Support',
              description: 'Round-the-clock customer service for all your needs'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/[0.02] border border-white/5 rounded-lg p-8 hover:border-[#49EACB]/20 transition"
            >
              <div className="w-12 h-12 rounded-lg bg-[#49EACB]/10 flex items-center justify-center mb-4 group-hover:bg-[#49EACB]/20 transition">
                <feature.icon className="w-6 h-6 text-[#49EACB]" />
              </div>
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/[0.02] border border-[#49EACB]/20 rounded-2xl p-12 text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and start shopping with KaShop today
          </p>
          <Button className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black px-8 py-6 text-lg rounded-full">
            Explore Now
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center text-white/40 text-sm">
            <p>© 2025 KaShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}