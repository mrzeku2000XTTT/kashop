import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Lightbulb, Users, Rocket } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function About() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To democratize e-commerce by building the most accessible, fast, and secure crypto payment platform on the Kaspa network.',
      color: 'from-[#49EACB] to-emerald-400'
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'Leveraging Kaspa\'s revolutionary blockDAG technology to deliver instant, secure transactions that traditional systems can\'t match.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Users,
      title: 'Community Powered',
      description: 'Built by crypto enthusiasts, for crypto enthusiasts. Every feature is designed with our community\'s feedback and needs in mind.',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: Rocket,
      title: 'Future Ready',
      description: 'Pioneering the next generation of decentralized commerce with cutting-edge blockchain technology and user-first design.',
      color: 'from-orange-400 to-red-500'
    }
  ];

  const stats = [
    { value: '<1s', label: 'Transaction Speed' },
    { value: '100%', label: 'Decentralized' },
    { value: '0.001%', label: 'Network Fees' },
    { value: '24/7', label: 'Global Access' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#49EACB]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
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
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            Reimagining{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#49EACB] to-[#49EACB]/60">
              E-commerce
            </span>
          </h1>
          <p className="text-xl text-white/60 leading-relaxed mb-12">
            kaShop is more than a marketplace—it's a movement towards truly decentralized, 
            instant, and borderless commerce built on the fastest blockchain network.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-[#49EACB] mb-2">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">What Drives Us</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Our core values shape every decision we make and every feature we build.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group relative"
            >
              <div className="relative p-10 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-500 h-full">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
                
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">{value.title}</h3>
                  <p className="text-white/60 text-lg leading-relaxed">{value.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative p-12 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10"
        >
          <h2 className="text-3xl font-bold mb-6">Powered by Kaspa</h2>
          <p className="text-white/60 text-lg leading-relaxed mb-6">
            We chose Kaspa because it represents the future of blockchain technology. 
            With its innovative blockDAG architecture, Kaspa achieves what traditional blockchains can't: 
            instant confirmations, high throughput, and minimal fees—all while maintaining complete decentralization.
          </p>
          <p className="text-white/60 text-lg leading-relaxed">
            This means your transactions are confirmed in under a second, you pay virtually no fees, 
            and you never have to worry about network congestion or slow processing times.
          </p>
        </motion.div>
      </section>

      {/* Join Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative p-12 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-[#49EACB]/10 to-purple-500/5 border border-[#49EACB]/20 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Join the Revolution</h2>
          <p className="text-white/60 text-lg mb-8">
            Be part of the next generation of e-commerce. Start selling or buying with Kaspa today.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-[#49EACB] hover:bg-[#49EACB]/90 text-black font-semibold px-8 py-6 text-lg rounded-full"
          >
            Get Started
          </Button>
        </motion.div>
      </section>
    </div>
  );
}