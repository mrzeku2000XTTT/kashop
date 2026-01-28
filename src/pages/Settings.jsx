import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from 'lucide-react';
import { createPageUrl } from '../utils';
import { useNavigate } from 'react-router-dom';
import Shop from '../components/Shop';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [activeTab, setActiveTab] = useState('shop');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser) {
          setUser(currentUser);
          setUserEmail(currentUser.email);
        } else {
          navigate('/');
        }
      } catch (error) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('auth_token');
    await base44.auth.logout('/');
  };

  if (!user) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-white/60 text-sm mt-1">{user.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/5"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('shop')}
              className={`py-4 px-1 border-b-2 transition ${
                activeTab === 'shop'
                  ? 'border-[#49EACB] text-white'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`py-4 px-1 border-b-2 transition ${
                activeTab === 'account'
                  ? 'border-[#49EACB] text-white'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              Account
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'shop' && <Shop userEmail={userEmail} />}
        
        {activeTab === 'account' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
              <div>
                <label className="text-white/60 text-sm">Email</label>
                <p className="text-white mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-white/60 text-sm">Full Name</label>
                <p className="text-white mt-1">{user.full_name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-white/60 text-sm">Role</label>
                <p className="text-white mt-1 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}