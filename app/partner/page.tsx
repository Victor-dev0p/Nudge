'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Mail, Search, UserPlus, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

export default function PartnerSelectionPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'invite' | 'search' | null>(null);
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = async () => {
    if (!email) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/partners/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setInviteSent(true);
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (error) {
      console.error('Invite error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4 shadow-lg shadow-purple-500/50">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Accountability Partner</h1>
          <p className="text-gray-400">Someone who won't let you quit. They'll know when you slack.</p>
        </div>

        {/* Selection Cards */}
        {!method && !inviteSent && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            
            {/* Invite a Friend */}
            <button
              onClick={() => setMethod('invite')}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/20 hover:border-purple-500/50 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Invite Someone</h3>
              <p className="text-gray-400 text-sm mb-4">
                Send an invite to a friend, colleague, or family member via email.
              </p>
              <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold">
                Get started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Find a Partner */}
            <button
              onClick={() => setMethod('search')}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/20 hover:border-indigo-500/50 transition-all text-left group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Find a Match</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get matched with someone who has similar goals and schedule.
              </p>
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
                Coming soon <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        )}

        {/* Invite Form */}
        {method === 'invite' && !inviteSent && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-6">
            <button
              onClick={() => setMethod(null)}
              className="text-gray-400 hover:text-white mb-6 text-sm"
            >
              ← Back to options
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Invite Your Partner</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Partner's Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-200 text-sm">
                  ⚠️ <strong>They'll see when you slack.</strong> They get notified if you miss tasks or break your streak.
                </p>
              </div>
            </div>

            <button
              onClick={handleInvite}
              disabled={!email || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending invite...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        )}

        {/* Search Form (Coming Soon) */}
        {method === 'search' && !inviteSent && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-6">
            <button
              onClick={() => setMethod(null)}
              className="text-gray-400 hover:text-white mb-6 text-sm"
            >
              ← Back to options
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Find a Match</h2>
            
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-gray-400 mb-6">
                We're building a matching system to pair you with someone who shares your goals and schedule.
              </p>
              <button
                onClick={() => setMethod(null)}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold"
              >
                Choose another option
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {inviteSent && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-green-500/50 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Invitation Sent! 🎯</h2>
            <p className="text-gray-300 mb-6">
              We've sent an email to <strong>{email}</strong>. They'll join you as your accountability partner.
            </p>
            <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
          </div>
        )}

        {/* Skip Option */}
        {!inviteSent && (
          <div className="text-center">
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white text-sm"
            >
              I'll add a partner later →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}