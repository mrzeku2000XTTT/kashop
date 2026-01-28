import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Trash2, Copy, Check } from 'lucide-react';

export default function WalletContactsModal({ userEmail, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '' });
  const queryClient = useQueryClient();

  const { data: contacts = [] } = useQuery({
    queryKey: ['walletContacts', userEmail],
    queryFn: () => base44.entities.WalletContact.filter({ userEmail }),
    enabled: !!userEmail,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.WalletContact.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletContacts', userEmail] });
      setFormData({ name: '', address: '' });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.WalletContact.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletContacts', userEmail] });
    },
  });

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      alert('Please fill in all fields');
      return;
    }
    createMutation.mutate({
      name: formData.name,
      address: formData.address,
      userEmail,
    });
  };

  const copyToClipboard = (address) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1100] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-[#49EACB]/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Wallet Contacts</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddContact} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 space-y-3">
            <div>
              <label className="text-white text-xs font-medium block mb-1">Contact Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. My Savings"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9 text-sm"
              />
            </div>
            <div>
              <label className="text-white text-xs font-medium block mb-1">Kaspa Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="kaspa:..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 bg-[#49EACB] hover:bg-[#49EACB]/90 text-black text-sm h-8"
              >
                {createMutation.isPending ? 'Adding...' : 'Add'}
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="ghost"
                className="flex-1 border border-white/10 text-white text-sm h-8"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {contacts.map(contact => (
            <div key={contact.id} className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-white font-medium text-sm">{contact.name}</p>
                <Button
                  onClick={() => deleteMutation.mutate(contact.id)}
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-white/60 text-xs truncate font-mono">{contact.address}</p>
                <Button
                  onClick={() => copyToClipboard(contact.address)}
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 flex-shrink-0 text-white/60 hover:text-white"
                >
                  {copied === contact.address ? (
                    <Check className="w-3 h-3 text-[#49EACB]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {contacts.length === 0 && !showForm && (
          <p className="text-white/40 text-xs text-center mb-4">No wallet contacts yet</p>
        )}

        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="w-full bg-[#49EACB]/10 hover:bg-[#49EACB]/20 border border-[#49EACB]/30 text-[#49EACB] text-sm h-9"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        )}
      </div>
    </div>
  );
}