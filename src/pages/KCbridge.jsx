import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function KCbridge() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(createPageUrl('Home'))}
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/5 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697a20c3d4a49d80e84fbf09/30427b4d9_image.png"
                alt="KCbridge"
                className="h-8 w-8 object-contain"
              />
              <h1 className="text-2xl font-bold">KCbridge</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <iframe
          src="https://kaspa.com/bridge"
          className="w-full h-screen border-0"
          title="KCbridge"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
        />
      </div>
    </div>
  );
}