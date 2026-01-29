import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, ShoppingCart, Package, DollarSign, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Docs() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: Wallet },
    { id: 'buying', title: 'Buying Products', icon: ShoppingCart },
    { id: 'selling', title: 'Selling Products', icon: Package },
    { id: 'payments', title: 'Payment Process', icon: DollarSign },
    { id: 'security', title: 'Security', icon: Shield },
    { id: 'faq', title: 'FAQ', icon: HelpCircle }
  ];

  const content = {
    'getting-started': {
      title: 'Getting Started with kaShop',
      items: [
        {
          title: '1. Connect Your Wallet',
          description: 'Click "Connect Wallet" in the top right corner. We support Kaspacom, Keystone, and other Kaspa-compatible wallets. Your wallet address serves as your account identifier.'
        },
        {
          title: '2. Browse Products',
          description: 'Explore the marketplace to discover products from sellers around the world. Use the Products page to view all available items or visit specific stores.'
        },
        {
          title: '3. Make Your First Purchase',
          description: 'Select a product, choose quantity, and click "Buy Now". You\'ll be guided through the payment process with real-time blockchain verification.'
        }
      ]
    },
    'buying': {
      title: 'How to Buy Products',
      items: [
        {
          title: 'Finding Products',
          description: 'Navigate to the Products page to browse all available items. Each product shows its price in KAS, stock availability, and seller information.'
        },
        {
          title: 'Placing an Order',
          description: 'Click on any product to view details. Select your desired quantity and click "Buy Now". A payment modal will appear with the seller\'s wallet address and total amount.'
        },
        {
          title: 'Completing Payment',
          description: 'Copy the seller\'s address, click "Start Verification", then send the exact KAS amount from your wallet. The system automatically verifies your payment on the blockchain within seconds.'
        },
        {
          title: 'Order Confirmation',
          description: 'Once verified, you\'ll receive a confirmation with your transaction ID. View all your purchases in the Orders page, accessible from the cart icon.'
        }
      ]
    },
    'selling': {
      title: 'How to Sell Products',
      items: [
        {
          title: 'Create a Store',
          description: 'Go to Settings → My Stores and create your first store. Add a name, description, and cover image. Your store is your brand identity on kaShop.'
        },
        {
          title: 'Add Products',
          description: 'Inside your store, click "Add Product". Provide product details including name, description, price in KAS, stock quantity, and upload product images.'
        },
        {
          title: 'Set Your Wallet Address',
          description: 'Each product requires a Kaspa wallet address where payments will be sent. This ensures you receive funds directly without intermediaries.'
        },
        {
          title: 'Manage Inventory',
          description: 'Track your stock levels in Store Management. Products automatically hide when sold out to prevent overselling.'
        }
      ]
    },
    'payments': {
      title: 'Payment Process',
      items: [
        {
          title: 'Direct Wallet-to-Wallet',
          description: 'All payments go directly from buyer to seller. No platform fees, no middlemen. You receive 100% of the sale price.'
        },
        {
          title: 'Instant Verification',
          description: 'Our system monitors the Kaspa blockchain in real-time. Once you send payment, it\'s verified within 3 seconds through automated blockchain polling.'
        },
        {
          title: 'Transaction Transparency',
          description: 'Every transaction is recorded on the Kaspa blockchain. You can verify any payment using the transaction ID on the Kaspa Explorer.'
        },
        {
          title: 'No Chargebacks',
          description: 'Blockchain transactions are final. This protects sellers from fraudulent chargebacks common in traditional payment systems.'
        }
      ]
    },
    'security': {
      title: 'Security & Safety',
      items: [
        {
          title: 'Blockchain Security',
          description: 'All transactions are secured by Kaspa\'s proof-of-work consensus and blockDAG architecture. Your funds are protected by enterprise-grade cryptography.'
        },
        {
          title: 'Non-Custodial',
          description: 'We never hold your funds. Your wallet, your keys, your crypto. You maintain complete control over your assets at all times.'
        },
        {
          title: 'Verification System',
          description: 'Our automated verification queries the Kaspa blockchain directly, ensuring payments are genuine and preventing double-spending attempts.'
        },
        {
          title: 'Best Practices',
          description: 'Always verify seller reputation, double-check wallet addresses before sending, and keep your private keys secure. Never share your seed phrase with anyone.'
        }
      ]
    },
    'faq': {
      title: 'Frequently Asked Questions',
      items: [
        {
          title: 'What is KAS?',
          description: 'KAS is the native cryptocurrency of the Kaspa network, a next-generation blockchain with instant transactions and minimal fees.'
        },
        {
          title: 'How do I get KAS?',
          description: 'Click the "Buy KAS" button in the header to access our integrated exchange. You can also purchase KAS on various cryptocurrency exchanges.'
        },
        {
          title: 'Are there any fees?',
          description: 'kaShop charges no platform fees. You only pay Kaspa network fees, which are typically less than $0.01 per transaction.'
        },
        {
          title: 'Can I cancel an order?',
          description: 'Once a blockchain transaction is sent, it cannot be reversed. Contact the seller directly if you need to discuss order issues.'
        },
        {
          title: 'What if payment verification fails?',
          description: 'Ensure you sent the exact amount to the correct address. Verification usually takes 3-10 seconds. If issues persist, check your transaction on Kaspa Explorer.'
        },
        {
          title: 'How do I contact sellers?',
          description: 'Currently, buyers should verify seller information before purchase. Direct messaging features are coming soon.'
        }
      ]
    }
  };

  const activeContent = content[activeSection];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#49EACB]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
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

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#49EACB] to-[#49EACB]/60">
              Documentation
            </span>
          </h1>
          <p className="text-xl text-white/60">
            Everything you need to know about buying, selling, and using kaShop.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-white/10 border border-[#49EACB]/30 text-white'
                        : 'bg-white/[0.02] border border-white/5 text-white/60 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.title}</span>
                    {activeSection === section.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/[0.03] border border-white/10">
                <h2 className="text-3xl font-bold mb-8">{activeContent.title}</h2>
                <div className="space-y-8">
                  {activeContent.items.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="text-xl font-semibold text-[#49EACB]">{item.title}</h3>
                      <p className="text-white/60 text-lg leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}