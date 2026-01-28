import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function Kaspacom() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 w-full">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Kaspacom</h1>
              <p className="text-white/60 text-sm mt-1">Kaspa Wallet & Onboarding</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 w-full overflow-hidden">
        <iframe
          src="https://wallet.kaspa.com/onboarding"
          className="w-full h-full border-0"
          title="Kaspacom Wallet"
        />
      </div>
    </div>
  );
}